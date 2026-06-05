'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { categories } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function getCategories() {
  await requireAuth()
  return db.select().from(categories).orderBy(desc(categories.createdAt))
}

export async function createCategory(data: {
  name: string
  description?: string
  imageUrl?: string
}) {
  await requireAuth()
  const [category] = await db
    .insert(categories)
    .values({
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
    })
    .returning()
  revalidatePath('/dashboard/products')
  return category
}

export async function updateCategory(
  id: number,
  data: {
    name?: string
    description?: string
    imageUrl?: string
    isActive?: boolean
  }
) {
  await requireAuth()
  const [category] = await db
    .update(categories)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(categories.id, id))
    .returning()
  revalidatePath('/dashboard/products')
  return category
}

export async function deleteCategory(id: number) {
  await requireAuth()
  await db.delete(categories).where(eq(categories.id, id))
  revalidatePath('/dashboard/products')
}

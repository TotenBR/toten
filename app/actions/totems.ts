'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { totems } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function getTotems() {
  await requireAuth()
  return db.select().from(totems).orderBy(desc(totems.createdAt))
}

export async function createTotem(data: {
  name: string
  location?: string
}) {
  await requireAuth()
  const [totem] = await db
    .insert(totems)
    .values({
      name: data.name,
      location: data.location,
      status: 'offline',
    })
    .returning()
  revalidatePath('/dashboard/totems')
  return totem
}

export async function updateTotem(
  id: number,
  data: {
    name?: string
    location?: string
    status?: string
    config?: Record<string, unknown>
  }
) {
  await requireAuth()
  const [totem] = await db
    .update(totems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(totems.id, id))
    .returning()
  revalidatePath('/dashboard/totems')
  return totem
}

export async function deleteTotem(id: number) {
  await requireAuth()
  await db.delete(totems).where(eq(totems.id, id))
  revalidatePath('/dashboard/totems')
}

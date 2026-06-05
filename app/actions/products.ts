'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products, categories } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function getProducts() {
  await requireAuth()
  return db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      price: products.price,
      imageUrl: products.imageUrl,
      categoryId: products.categoryId,
      isAvailable: products.isAvailable,
      stock: products.stock,
      createdAt: products.createdAt,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(desc(products.createdAt))
}

export async function createProduct(data: {
  name: string
  description?: string
  price: string
  imageUrl?: string
  categoryId?: number
  stock?: number
}) {
  await requireAuth()
  const [product] = await db
    .insert(products)
    .values({
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      categoryId: data.categoryId,
      stock: data.stock ?? 0,
    })
    .returning()
  revalidatePath('/dashboard/products')
  return product
}

export async function updateProduct(
  id: number,
  data: {
    name?: string
    description?: string
    price?: string
    imageUrl?: string
    categoryId?: number
    isAvailable?: boolean
    stock?: number
  }
) {
  await requireAuth()
  const [product] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning()
  revalidatePath('/dashboard/products')
  return product
}

export async function deleteProduct(id: number) {
  await requireAuth()
  await db.delete(products).where(eq(products.id, id))
  revalidatePath('/dashboard/products')
}

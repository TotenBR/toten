'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { orders, orderItems, products, totems } from '@/lib/db/schema'
import { eq, desc, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function getOrders() {
  await requireAuth()
  return db
    .select({
      id: orders.id,
      totemId: orders.totemId,
      status: orders.status,
      total: orders.total,
      paymentMethod: orders.paymentMethod,
      customerName: orders.customerName,
      notes: orders.notes,
      createdAt: orders.createdAt,
      totemName: totems.name,
    })
    .from(orders)
    .leftJoin(totems, eq(orders.totemId, totems.id))
    .orderBy(desc(orders.createdAt))
}

export async function getOrderWithItems(orderId: number) {
  await requireAuth()
  const [order] = await db
    .select({
      id: orders.id,
      totemId: orders.totemId,
      status: orders.status,
      total: orders.total,
      paymentMethod: orders.paymentMethod,
      customerName: orders.customerName,
      notes: orders.notes,
      createdAt: orders.createdAt,
      totemName: totems.name,
    })
    .from(orders)
    .leftJoin(totems, eq(orders.totemId, totems.id))
    .where(eq(orders.id, orderId))

  const items = await db
    .select({
      id: orderItems.id,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      subtotal: orderItems.subtotal,
      productName: products.name,
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, orderId))

  return { order, items }
}

export async function updateOrderStatus(id: number, status: string) {
  await requireAuth()
  const [order] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning()
  revalidatePath('/dashboard/orders')
  return order
}

export async function getDashboardStats() {
  await requireAuth()
  
  const [orderStats] = await db
    .select({
      totalOrders: sql<number>`count(*)::int`,
      totalRevenue: sql<string>`coalesce(sum(${orders.total}), 0)`,
      pendingOrders: sql<number>`count(*) filter (where ${orders.status} = 'pending')::int`,
    })
    .from(orders)

  const [productCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products)

  const [totemCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(totems)

  const [onlineTotems] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(totems)
    .where(eq(totems.status, 'online'))

  const recentOrders = await db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      customerName: orders.customerName,
      createdAt: orders.createdAt,
      totemName: totems.name,
    })
    .from(orders)
    .leftJoin(totems, eq(orders.totemId, totems.id))
    .orderBy(desc(orders.createdAt))
    .limit(5)

  return {
    totalOrders: orderStats?.totalOrders ?? 0,
    totalRevenue: orderStats?.totalRevenue ?? '0',
    pendingOrders: orderStats?.pendingOrders ?? 0,
    totalProducts: productCount?.count ?? 0,
    totalTotems: totemCount?.count ?? 0,
    onlineTotems: onlineTotems?.count ?? 0,
    recentOrders,
  }
}

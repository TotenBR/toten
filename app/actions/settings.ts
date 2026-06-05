'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { settings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user
}

export async function getSettings() {
  await requireAuth()
  return db.select().from(settings)
}

export async function getSetting(key: string) {
  await requireAuth()
  const [setting] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, key))
  return setting
}

export async function upsertSetting(key: string, value: string, description?: string) {
  await requireAuth()
  
  const existing = await getSetting(key)
  
  if (existing) {
    const [setting] = await db
      .update(settings)
      .set({ value, description, updatedAt: new Date() })
      .where(eq(settings.key, key))
      .returning()
    revalidatePath('/dashboard/settings')
    return setting
  }
  
  const [setting] = await db
    .insert(settings)
    .values({ key, value, description })
    .returning()
  revalidatePath('/dashboard/settings')
  return setting
}

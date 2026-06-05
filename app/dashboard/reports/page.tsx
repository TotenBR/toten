import { getDashboardStats } from '@/app/actions/orders'
import { ReportsClient } from '@/components/dashboard/reports-client'

export default async function ReportsPage() {
  const stats = await getDashboardStats()

  return <ReportsClient stats={stats} />
}

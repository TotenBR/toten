import { getTotems } from '@/app/actions/totems'
import { TotemsClient } from '@/components/dashboard/totems-client'

export default async function TotemsPage() {
  const totems = await getTotems()

  return <TotemsClient initialTotems={totems} />
}

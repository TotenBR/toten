import { getSettings } from '@/app/actions/settings'
import { SettingsClient } from '@/components/dashboard/settings-client'

export default async function SettingsPage() {
  const settings = await getSettings()

  return <SettingsClient initialSettings={settings} />
}

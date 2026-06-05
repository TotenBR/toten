'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { upsertSetting } from '@/app/actions/settings'
import type { Setting } from '@/lib/db/schema'

type SettingsMap = Record<string, string>

export function SettingsClient({ initialSettings }: { initialSettings: Setting[] }) {
  const settingsMap = initialSettings.reduce((acc, s) => {
    acc[s.key] = s.value ?? ''
    return acc
  }, {} as SettingsMap)

  const [storeName, setStoreName] = useState(settingsMap['store_name'] ?? '')
  const [storeDescription, setStoreDescription] = useState(settingsMap['store_description'] ?? '')
  const [currency, setCurrency] = useState(settingsMap['currency'] ?? 'BRL')
  const [taxRate, setTaxRate] = useState(settingsMap['tax_rate'] ?? '0')
  const [orderPrefix, setOrderPrefix] = useState(settingsMap['order_prefix'] ?? 'PED')
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(settingsMap['auto_accept_orders'] === 'true')
  const [enableNotifications, setEnableNotifications] = useState(settingsMap['enable_notifications'] !== 'false')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    setSaved(false)
    await Promise.all([
      upsertSetting('store_name', storeName, 'Nome da loja'),
      upsertSetting('store_description', storeDescription, 'Descricao da loja'),
      upsertSetting('currency', currency, 'Moeda padrao'),
      upsertSetting('tax_rate', taxRate, 'Taxa de imposto (%)'),
      upsertSetting('order_prefix', orderPrefix, 'Prefixo dos pedidos'),
      upsertSetting('auto_accept_orders', autoAcceptOrders.toString(), 'Aceitar pedidos automaticamente'),
      upsertSetting('enable_notifications', enableNotifications.toString(), 'Habilitar notificacoes'),
    ])
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuracoes</h1>
        <p className="text-muted-foreground">
          Gerencie as configuracoes do seu sistema de autoatendimento
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Informacoes da Loja</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Nome da Loja</Label>
              <Input
                id="storeName"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Minha Loja"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Descricao</Label>
              <Textarea
                id="storeDescription"
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                placeholder="Uma breve descricao da sua loja..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Configuracoes Financeiras</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Input
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="BRL"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Taxa de Imposto (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Configuracoes de Pedidos</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderPrefix">Prefixo dos Pedidos</Label>
              <Input
                id="orderPrefix"
                value={orderPrefix}
                onChange={(e) => setOrderPrefix(e.target.value)}
                placeholder="PED"
              />
              <p className="text-xs text-muted-foreground">
                Os pedidos serao exibidos como: {orderPrefix}-001, {orderPrefix}-002, etc.
              </p>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Aceitar Pedidos Automaticamente</Label>
                <p className="text-xs text-muted-foreground">
                  Pedidos serao aceitos sem necessidade de confirmacao manual
                </p>
              </div>
              <Switch
                checked={autoAcceptOrders}
                onCheckedChange={setAutoAcceptOrders}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notificacoes</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Habilitar Notificacoes</Label>
                <p className="text-xs text-muted-foreground">
                  Receba alertas sobre novos pedidos e atualizacoes
                </p>
              </div>
              <Switch
                checked={enableNotifications}
                onCheckedChange={setEnableNotifications}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Configuracoes'}
        </Button>
        {saved && (
          <span className="text-sm text-green-600">Configuracoes salvas com sucesso!</span>
        )}
      </div>
    </div>
  )
}

'use client'

import { Card } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'

type DashboardStats = {
  totalOrders: number
  totalRevenue: string
  pendingOrders: number
  totalProducts: number
  totalTotems: number
  onlineTotems: number
  recentOrders: {
    id: number
    total: string
    status: string | null
    customerName: string | null
    createdAt: Date | null
    totemName: string | null
  }[]
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

export function ReportsClient({ stats }: { stats: DashboardStats }) {
  // Mock data for charts - in production this would come from actual analytics
  const ordersByStatus = [
    { name: 'Pendente', value: stats.pendingOrders },
    { name: 'Preparando', value: Math.floor(stats.totalOrders * 0.2) },
    { name: 'Pronto', value: Math.floor(stats.totalOrders * 0.1) },
    { name: 'Entregue', value: Math.floor(stats.totalOrders * 0.6) },
    { name: 'Cancelado', value: Math.floor(stats.totalOrders * 0.1) },
  ].filter((item) => item.value > 0)

  const revenueByDay = [
    { day: 'Seg', revenue: Number(stats.totalRevenue) * 0.12 },
    { day: 'Ter', revenue: Number(stats.totalRevenue) * 0.15 },
    { day: 'Qua', revenue: Number(stats.totalRevenue) * 0.18 },
    { day: 'Qui', revenue: Number(stats.totalRevenue) * 0.14 },
    { day: 'Sex', revenue: Number(stats.totalRevenue) * 0.22 },
    { day: 'Sab', revenue: Number(stats.totalRevenue) * 0.12 },
    { day: 'Dom', revenue: Number(stats.totalRevenue) * 0.07 },
  ]

  const ordersTrend = [
    { hour: '08h', orders: Math.floor(stats.totalOrders * 0.05) },
    { hour: '10h', orders: Math.floor(stats.totalOrders * 0.1) },
    { hour: '12h', orders: Math.floor(stats.totalOrders * 0.2) },
    { hour: '14h', orders: Math.floor(stats.totalOrders * 0.15) },
    { hour: '16h', orders: Math.floor(stats.totalOrders * 0.1) },
    { hour: '18h', orders: Math.floor(stats.totalOrders * 0.15) },
    { hour: '20h', orders: Math.floor(stats.totalOrders * 0.2) },
    { hour: '22h', orders: Math.floor(stats.totalOrders * 0.05) },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Relatorios</h1>
        <p className="text-muted-foreground">
          Analise o desempenho do seu sistema de autoatendimento
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total de Pedidos</div>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Faturamento Total</div>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Ticket Medio</div>
          <div className="text-2xl font-bold">
            {stats.totalOrders > 0
              ? formatCurrency(Number(stats.totalRevenue) / stats.totalOrders)
              : formatCurrency(0)}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Taxa Totens Online</div>
          <div className="text-2xl font-bold">
            {stats.totalTotems > 0
              ? `${Math.round((stats.onlineTotems / stats.totalTotems) * 100)}%`
              : '0%'}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Faturamento por Dia da Semana</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(value) => `R$${value}`} />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelStyle={{ color: 'var(--foreground)' }}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Pedidos por Status</h2>
          <div className="h-[300px]">
            {ordersByStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ordersByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ordersByStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Nenhum dado disponivel
              </div>
            )}
          </div>
          {ordersByStatus.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {ordersByStatus.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Pedidos por Horario</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

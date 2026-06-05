import { getDashboardStats } from '@/app/actions/orders'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ShoppingCart,
  DollarSign,
  Package,
  Monitor,
  Clock,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

function getStatusBadge(status: string | null) {
  const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pendente', variant: 'secondary' },
    preparing: { label: 'Preparando', variant: 'default' },
    ready: { label: 'Pronto', variant: 'outline' },
    delivered: { label: 'Entregue', variant: 'default' },
    cancelled: { label: 'Cancelado', variant: 'destructive' },
  }
  const { label, variant } = statusMap[status ?? 'pending'] ?? statusMap.pending
  return <Badge variant={variant}>{label}</Badge>
}

export default async function DashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Visao geral do seu sistema de autoatendimento
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Pedidos</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Faturamento</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Produtos</p>
              <p className="text-2xl font-bold">{stats.totalProducts}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Monitor className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Totens Online</p>
              <p className="text-2xl font-bold">
                {stats.onlineTotems}/{stats.totalTotems}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Pedidos Pendentes</h2>
            <Badge variant="secondary">{stats.pendingOrders}</Badge>
          </div>
          {stats.pendingOrders === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum pedido pendente</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              Voce tem {stats.pendingOrders} pedido(s) aguardando atencao
            </p>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Pedidos Recentes</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">Nenhum pedido ainda</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Pedido #{order.id}
                        {order.customerName && ` - ${order.customerName}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.totemName ?? 'Totem desconhecido'} •{' '}
                        {order.createdAt
                          ? formatDistanceToNow(new Date(order.createdAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })
                          : 'Data desconhecida'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(order.status)}
                    <span className="text-sm font-medium">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

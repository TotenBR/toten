'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { updateOrderStatus, getOrderWithItems } from '@/app/actions/orders'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

type OrderWithTotem = {
  id: number
  totemId: number | null
  status: string | null
  total: string
  paymentMethod: string | null
  customerName: string | null
  notes: string | null
  createdAt: Date | null
  totemName: string | null
}

type OrderItem = {
  id: number
  quantity: number
  unitPrice: string
  subtotal: string
  productName: string | null
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

const statusOptions = [
  { value: 'pending', label: 'Pendente' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'ready', label: 'Pronto' },
  { value: 'delivered', label: 'Entregue' },
  { value: 'cancelled', label: 'Cancelado' },
]

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

export function OrdersClient({ initialOrders }: { initialOrders: OrderWithTotem[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<{
    order: OrderWithTotem
    items: OrderItem[]
  } | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      order.totemName?.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toString().includes(search)
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = async (orderId: number, status: string) => {
    await updateOrderStatus(orderId, status)
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    )
  }

  const handleViewDetails = async (order: OrderWithTotem) => {
    const details = await getOrderWithItems(order.id)
    setSelectedOrder({ order: details.order as OrderWithTotem, items: details.items })
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
        <p className="text-muted-foreground">
          Gerencie os pedidos recebidos dos totens
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total</div>
          <div className="text-2xl font-bold">{orders.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Pendentes</div>
          <div className="text-2xl font-bold text-amber-600">
            {orders.filter((o) => o.status === 'pending').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Preparando</div>
          <div className="text-2xl font-bold text-blue-600">
            {orders.filter((o) => o.status === 'preparing').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Prontos</div>
          <div className="text-2xl font-bold text-green-600">
            {orders.filter((o) => o.status === 'ready').length}
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pedidos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Totem</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-[150px]">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{order.customerName ?? '-'}</TableCell>
                  <TableCell>{order.totemName ?? '-'}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    {order.createdAt
                      ? formatDistanceToNow(new Date(order.createdAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Select
                        value={order.status ?? 'pending'}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                      >
                        <SelectTrigger className="w-[110px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pedido #{selectedOrder?.order.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Cliente:</span>
                  <p className="font-medium">{selectedOrder.order.customerName ?? '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Totem:</span>
                  <p className="font-medium">{selectedOrder.order.totemName ?? '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pagamento:</span>
                  <p className="font-medium">{selectedOrder.order.paymentMethod ?? '-'}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p>{getStatusBadge(selectedOrder.order.status)}</p>
                </div>
              </div>
              {selectedOrder.order.notes && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Observacoes:</span>
                  <p>{selectedOrder.order.notes}</p>
                </div>
              )}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Itens do Pedido</h4>
                {selectedOrder.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum item</p>
                ) : (
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm py-1 border-b last:border-0"
                      >
                        <span>
                          {item.quantity}x {item.productName ?? 'Produto'}
                        </span>
                        <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-medium pt-2">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.order.total)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

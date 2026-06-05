'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { Plus, Pencil, Trash2, Search, Wifi, WifiOff } from 'lucide-react'
import { createTotem, updateTotem, deleteTotem } from '@/app/actions/totems'
import type { Totem } from '@/lib/db/schema'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function TotemsClient({ initialTotems }: { initialTotems: Totem[] }) {
  const [totems, setTotems] = useState(initialTotems)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTotem, setEditingTotem] = useState<Totem | null>(null)
  const [loading, setLoading] = useState(false)

  const filteredTotems = totems.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location?.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      location: formData.get('location') as string,
    }

    if (editingTotem) {
      const updated = await updateTotem(editingTotem.id, data)
      setTotems((prev) => prev.map((t) => (t.id === editingTotem.id ? updated : t)))
    } else {
      const totem = await createTotem(data)
      setTotems((prev) => [totem, ...prev])
    }
    setDialogOpen(false)
    setEditingTotem(null)
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este totem?')) return
    await deleteTotem(id)
    setTotems((prev) => prev.filter((t) => t.id !== id))
  }

  const handleStatusChange = async (id: number, status: string) => {
    const updated = await updateTotem(id, { status })
    setTotems((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  const getStatusBadge = (status: string | null) => {
    if (status === 'online') {
      return (
        <Badge variant="default" className="gap-1">
          <Wifi className="h-3 w-3" />
          Online
        </Badge>
      )
    }
    return (
      <Badge variant="secondary" className="gap-1">
        <WifiOff className="h-3 w-3" />
        Offline
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Totens</h1>
          <p className="text-muted-foreground">
            Gerencie seus totens de autoatendimento
          </p>
        </div>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) setEditingTotem(null)
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Totem
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTotem ? 'Editar Totem' : 'Novo Totem'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={editingTotem?.name}
                  placeholder="Ex: Totem 01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Localizacao</Label>
                <Input
                  id="location"
                  name="location"
                  defaultValue={editingTotem?.location ?? ''}
                  placeholder="Ex: Entrada principal"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Salvando...' : editingTotem ? 'Atualizar' : 'Criar Totem'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Total de Totens</div>
          <div className="text-2xl font-bold">{totems.length}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Online</div>
          <div className="text-2xl font-bold text-green-600">
            {totems.filter((t) => t.status === 'online').length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm font-medium text-muted-foreground">Offline</div>
          <div className="text-2xl font-bold text-muted-foreground">
            {totems.filter((t) => t.status !== 'online').length}
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar totens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Localizacao</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ultimo Ping</TableHead>
              <TableHead className="w-[150px]">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTotems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Nenhum totem encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredTotems.map((totem) => (
                <TableRow key={totem.id}>
                  <TableCell className="font-medium">{totem.name}</TableCell>
                  <TableCell>{totem.location ?? '-'}</TableCell>
                  <TableCell>{getStatusBadge(totem.status)}</TableCell>
                  <TableCell>
                    {totem.lastPing
                      ? formatDistanceToNow(new Date(totem.lastPing), {
                          addSuffix: true,
                          locale: ptBR,
                        })
                      : 'Nunca'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Select
                        value={totem.status ?? 'offline'}
                        onValueChange={(value) => handleStatusChange(totem.id, value)}
                      >
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="offline">Offline</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingTotem(totem)
                          setDialogOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(totem.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

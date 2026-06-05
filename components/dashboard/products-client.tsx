'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/products'
import { createCategory, deleteCategory } from '@/app/actions/categories'
import type { Category } from '@/lib/db/schema'

type ProductWithCategory = {
  id: number
  name: string
  description: string | null
  price: string
  imageUrl: string | null
  categoryId: number | null
  isAvailable: boolean | null
  stock: number | null
  createdAt: Date | null
  categoryName: string | null
}

function formatCurrency(value: string | number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value))
}

export function ProductsClient({
  initialProducts,
  initialCategories,
}: {
  initialProducts: ProductWithCategory[]
  initialCategories: Category[]
}) {
  const [products, setProducts] = useState(initialProducts)
  const [categories, setCategories] = useState(initialCategories)
  const [search, setSearch] = useState('')
  const [productOpen, setProductOpen] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null)
  const [loading, setLoading] = useState(false)

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(search.toLowerCase())
  )

  const handleProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: formData.get('price') as string,
      categoryId: formData.get('categoryId') ? Number(formData.get('categoryId')) : undefined,
      stock: formData.get('stock') ? Number(formData.get('stock')) : 0,
    }

    if (editingProduct) {
      await updateProduct(editingProduct.id, data)
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                ...data,
                categoryName: categories.find((c) => c.id === data.categoryId)?.name ?? null,
              }
            : p
        )
      )
    } else {
      const product = await createProduct(data)
      setProducts((prev) => [
        {
          ...product,
          categoryName: categories.find((c) => c.id === data.categoryId)?.name ?? null,
        },
        ...prev,
      ])
    }
    setProductOpen(false)
    setEditingProduct(null)
    setLoading(false)
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return
    await deleteProduct(id)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
    }
    const category = await createCategory(data)
    setCategories((prev) => [category, ...prev])
    setCategoryOpen(false)
    setLoading(false)
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return
    await deleteCategory(id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos disponiveis nos totens
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Categoria</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cat-name">Nome</Label>
                  <Input id="cat-name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cat-description">Descricao</Label>
                  <Textarea id="cat-description" name="description" />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Salvando...' : 'Criar Categoria'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={productOpen} onOpenChange={(open) => {
            setProductOpen(open)
            if (!open) setEditingProduct(null)
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Produto
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleProductSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    defaultValue={editingProduct?.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descricao</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={editingProduct?.description ?? ''}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preco (R$)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      required
                      defaultValue={editingProduct?.price}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Estoque</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      defaultValue={editingProduct?.stock ?? 0}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Categoria</Label>
                  <Select
                    name="categoryId"
                    defaultValue={editingProduct?.categoryId?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Salvando...' : editingProduct ? 'Atualizar' : 'Criar Produto'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {categories.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium mb-3">Categorias</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat.id}
                variant="secondary"
                className="gap-2 pr-1"
              >
                {cat.name}
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <Card>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos..."
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
              <TableHead>Categoria</TableHead>
              <TableHead>Preco</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  Nenhum produto encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.categoryName ?? '-'}</TableCell>
                  <TableCell>{formatCurrency(product.price)}</TableCell>
                  <TableCell>{product.stock ?? 0}</TableCell>
                  <TableCell>
                    <Badge variant={product.isAvailable ? 'default' : 'secondary'}>
                      {product.isAvailable ? 'Disponivel' : 'Indisponivel'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingProduct(product)
                          setProductOpen(true)
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
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

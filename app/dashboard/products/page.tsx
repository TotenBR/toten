import { getProducts } from '@/app/actions/products'
import { getCategories } from '@/app/actions/categories'
import { ProductsClient } from '@/components/dashboard/products-client'

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()])

  return <ProductsClient initialProducts={products} initialCategories={categories} />
}

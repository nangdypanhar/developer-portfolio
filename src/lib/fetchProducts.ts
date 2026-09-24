import type { Product } from '../types/product'
import { supabase } from './supabase'

interface ProductRow {
  id: string
  name: string
  price: number
  in_stock: boolean
  on_sale: boolean
  cost_price: number
}

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price),
    inStock: row.in_stock,
    onSale: row.on_sale,
    costPrice: Number(row.cost_price),
  }
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, in_stock, on_sale, cost_price')
    .order('created_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to load products (${error.message})`)
  }

  return (data as ProductRow[]).map(toProduct)
}

export async function createProduct(name: string, price: number): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name,
      price,
      in_stock: true,
      on_sale: false,
      cost_price: Math.round(price * 0.6 * 100) / 100,
    })
    .select('id, name, price, in_stock, on_sale, cost_price')
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return toProduct(data as ProductRow)
}

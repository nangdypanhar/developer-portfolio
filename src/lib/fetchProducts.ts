import type { Product } from '../types/product'

const PRODUCTS_URL = '/products.json'

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(PRODUCTS_URL)

  if (!response.ok) {
    throw new Error(`Failed to load products (${response.status})`)
  }

  return (await response.json()) as Product[]
}

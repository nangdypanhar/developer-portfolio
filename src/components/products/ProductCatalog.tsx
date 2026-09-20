import { useState } from 'react'
import type { Product } from '../../types/product'
import AddProductForm from './AddProductForm'
import ProductCard from './ProductCard'

const initialProducts: Product[] = [
  { id: 'p1', name: 'Mechanical Keyboard', price: 89, inStock: true, onSale: true },
  { id: 'p2', name: 'Wireless Mouse', price: 29, inStock: true, onSale: false },
  { id: 'p3', name: '27" Monitor', price: 249, inStock: false, onSale: false },
  { id: 'p4', name: 'USB-C Dock', price: 59, inStock: true, onSale: true },
  { id: 'p5', name: 'Webcam 1080p', price: 39, inStock: false, onSale: false },
  { id: 'p6', name: 'Desk Lamp', price: 19, inStock: true, onSale: false },
]

function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [inStockOnly, setInStockOnly] = useState(false)

  const visibleProducts = inStockOnly ? products.filter((product) => product.inStock) : products
  const onSaleCount = products.filter((product) => product.onSale).length

  function handleAddProduct(name: string, price: number) {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name,
      price,
      inStock: true,
      onSale: false,
    }
    setProducts((prev) => [...prev, newProduct])
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Product Catalog</h2>
          <span className="text-sm text-gray-500">{visibleProducts.length} products</span>
          {onSaleCount > 0 && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
              {onSaleCount} on sale
            </span>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          In stock only
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <AddProductForm onAdd={handleAddProduct} />
    </section>
  )
}

export default ProductCatalog

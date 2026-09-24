import { useEffect, useState, type ChangeEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import { createProduct, fetchProducts } from '../../lib/fetchProducts'
import type { Product, PublicProduct } from '../../types/product'
import AddProductForm from './AddProductForm'
import ProductCard from './ProductCard'

function toPublicProduct({ costPrice, ...publicProduct }: Product): PublicProduct {
  return publicProduct
}

function ProductCatalog() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((error: unknown) => {
        setLoadError(error instanceof Error ? error.message : 'Failed to load products.')
      })
  }, [])

  function handleInStockOnlyChange(e: ChangeEvent<HTMLInputElement>) {
    setInStockOnly(e.target.checked)
  }

  async function handleAddProduct(name: string, price: number) {
    setAddError(null)
    try {
      const newProduct = await createProduct(name, price)
      setProducts((prev) => [...(prev ?? []), newProduct])
    } catch (error: unknown) {
      setAddError(error instanceof Error ? error.message : 'Failed to add product.')
    }
  }

  if (loadError) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not load products: {loadError}
      </section>
    )
  }

  if (!products) {
    return <p className="text-sm text-gray-500">Loading products…</p>
  }

  const visibleProducts = inStockOnly ? products.filter((product) => product.inStock) : products
  const publicProducts = visibleProducts.map(toPublicProduct)
  const onSaleCount = products.filter((product) => product.onSale).length

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Product Catalog</h2>
          <span className="text-sm text-gray-500">{publicProducts.length} products</span>
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
            onChange={handleInStockOnlyChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          In stock only
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {publicProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {user ? (
        <>
          <AddProductForm onAdd={handleAddProduct} />
          {addError && <p className="text-sm text-red-600">Could not add product: {addError}</p>}
        </>
      ) : (
        <p className="text-sm text-gray-500">Sign in to add products.</p>
      )}
    </section>
  )
}

export default ProductCatalog

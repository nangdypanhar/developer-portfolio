import type { Product } from '../../types/product'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-gray-900">{product.name}</h3>
        <span
          className={
            product.inStock
              ? 'w-fit shrink-0 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700'
              : 'w-fit shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500'
          }
        >
          {product.inStock ? 'In stock' : 'Sold out'}
        </span>
      </div>
      <p className="text-sm text-gray-700">${product.price.toFixed(2)}</p>
    </div>
  )
}

export default ProductCard

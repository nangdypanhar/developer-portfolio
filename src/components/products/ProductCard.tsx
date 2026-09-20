import { useCart } from '../../context/CartContext'
import type { PublicProduct } from '../../types/product'

interface ProductCardProps {
  product: PublicProduct
}

function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()

  function handleAddToCart() {
    dispatch({
      type: 'ADD_ITEM',
      item: { id: product.id, name: product.name, price: product.price },
    })
  }

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
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!product.inStock}
        className="mt-1 w-fit rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        Add to cart
      </button>
    </div>
  )
}

export default ProductCard

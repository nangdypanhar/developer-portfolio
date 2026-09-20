import { useCart } from '../../context/CartContext'

interface CartLineItemProps {
  id: string
}

function CartLineItem({ id }: CartLineItemProps) {
  const { items, dispatch } = useCart()
  const line = items.find((item) => item.id === id)

  if (!line) {
    return null
  }

  function handleDecrease() {
    if (!line) return
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity: line.quantity - 1 })
  }

  function handleIncrease() {
    if (!line) return
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity: line.quantity + 1 })
  }

  function handleRemove() {
    dispatch({ type: 'REMOVE_ITEM', id })
  }

  return (
    <li className="flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900">{line.name}</span>
        <span className="text-xs text-gray-500">${line.price.toFixed(2)} each</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrease}
          className="h-6 w-6 rounded border border-gray-300 text-sm text-gray-600 transition-colors hover:bg-gray-100"
        >
          −
        </button>
        <span className="w-6 text-center text-sm text-gray-900">{line.quantity}</span>
        <button
          type="button"
          onClick={handleIncrease}
          className="h-6 w-6 rounded border border-gray-300 text-sm text-gray-600 transition-colors hover:bg-gray-100"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleRemove}
          className="ml-2 text-xs font-medium text-gray-400 transition-colors hover:text-red-600"
        >
          Remove
        </button>
      </div>
    </li>
  )
}

export default CartLineItem

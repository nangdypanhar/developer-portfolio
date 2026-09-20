import { useCart } from '../../context/CartContext'

function CheckoutSummary() {
  const { items } = useCart()

  const itemCount = items.reduce((sum, line) => sum + line.quantity, 0)
  const total = items.reduce((sum, line) => sum + line.price * line.quantity, 0)

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-900">Checkout Summary</h3>
      <p className="text-sm text-gray-700">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>
      <p className="text-lg font-semibold text-gray-900">${total.toFixed(2)}</p>
    </div>
  )
}

export default CheckoutSummary

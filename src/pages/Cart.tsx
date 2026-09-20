import CartLineItem from '../components/cart/CartLineItem'
import CheckoutSummary from '../components/cart/CheckoutSummary'
import { useCart } from '../context/CartContext'

function Cart() {
  const { items } = useCart()

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold text-gray-900">Cart</h2>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Your cart is empty.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => (
            <CartLineItem key={item.id} id={item.id} />
          ))}
        </ul>
      )}

      <CheckoutSummary />
    </section>
  )
}

export default Cart

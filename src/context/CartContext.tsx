import { createContext, useContext, useEffect, useMemo, useReducer, type Dispatch, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface CartLine {
  id: string
  name: string
  price: number
  quantity: number
}

type CartAction =
  | { type: 'ADD_ITEM'; item: { id: string; name: string; price: number } }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }

function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((line) => line.id === action.item.id)
      if (existing) {
        return state.map((line) => (line.id === action.item.id ? { ...line, quantity: line.quantity + 1 } : line))
      }
      return [...state, { ...action.item, quantity: 1 }]
    }

    case 'REMOVE_ITEM':
      return state.filter((line) => line.id !== action.id)

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return state.filter((line) => line.id !== action.id)
      }
      return state.map((line) => (line.id === action.id ? { ...line, quantity: action.quantity } : line))
    }

    default:
      return state
  }
}

interface CartContextValue {
  items: CartLine[]
  dispatch: Dispatch<CartAction>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [storedItems, setStoredItems] = useLocalStorage<CartLine[]>('cart-items', [])
  const [items, dispatch] = useReducer(cartReducer, storedItems)

  useEffect(() => {
    setStoredItems(items)
  }, [items, setStoredItems])

  const value = useMemo(() => ({ items, dispatch }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

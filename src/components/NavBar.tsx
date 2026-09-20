import { useState, type FormEvent } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import WindowWidth from './WindowWidth'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/todos', label: 'Todos' },
  { to: '/users', label: 'Users' },
  { to: '/cart', label: 'Cart' },
]

function AuthControl() {
  const { user, signIn, signOut } = useAuth()
  const [email, setEmail] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = email.trim()
    if (trimmed.length === 0) {
      return
    }
    signIn(trimmed)
    setEmail('')
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Hi, {user.email}</span>
        <button
          type="button"
          onClick={signOut}
          className="text-xs font-medium text-gray-500 transition-colors hover:text-red-600"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-40 rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-900 focus:border-indigo-500 focus:outline-none"
      />
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
      >
        Sign in
      </button>
    </form>
  )
}

function NavBar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div className="flex flex-wrap items-center gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'text-sm font-semibold text-indigo-600'
                  : 'text-sm font-medium text-gray-500 transition-colors hover:text-gray-900'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <AuthControl />
          <WindowWidth />
        </div>
      </div>
    </nav>
  )
}

export default NavBar

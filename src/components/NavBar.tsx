import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import WindowWidth from './WindowWidth'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/todos', label: 'Todos' },
  { to: '/users', label: 'Users' },
  { to: '/cart', label: 'Cart' },
  { to: '/debounce-demo', label: 'Debounce' },
]

function AuthControl() {
  const { user, loading, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  if (loading) {
    return null
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Hi, {user.email}</span>
        <button
          type="button"
          onClick={handleSignOut}
          className="text-xs font-medium text-gray-500 transition-colors hover:text-red-600"
        >
          Sign out
        </button>
      </div>
    )
  }

  return (
    <Link
      to="/login"
      className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
    >
      Sign in
    </Link>
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

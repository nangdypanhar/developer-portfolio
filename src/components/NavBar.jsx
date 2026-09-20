import { NavLink } from 'react-router-dom'
import WindowWidth from './WindowWidth'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/todos', label: 'Todos' },
  { to: '/users', label: 'Users' },
]

function NavBar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-4 md:px-8">
        <div className="flex items-center gap-6">
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
        <WindowWidth />
      </div>
    </nav>
  )
}

export default NavBar

import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="flex flex-col items-center gap-3 py-16 text-center">
      <h1 className="text-2xl font-semibold text-gray-900">404 — Page not found</h1>
      <p className="text-sm text-gray-500">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        Go back home
      </Link>
    </section>
  )
}

export default NotFound

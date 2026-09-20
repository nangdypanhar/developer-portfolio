import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

function UserDirectory() {
  const [status, setStatus] = useState('loading')
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false

    fetch(USERS_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load users (${response.status})`)
        }
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        setUsers(data)
        setStatus('success')
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load users.')
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900">User Directory</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name…"
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {status === 'loading' && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((placeholder) => (
            <li key={placeholder} className="h-16 animate-pulse rounded-lg border border-gray-200 bg-gray-100" />
          ))}
        </ul>
      )}

      {status === 'error' && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Could not load users: {error}
        </p>
      )}

      {status === 'success' && filteredUsers.length === 0 && (
        <p className="text-sm text-gray-500">
          {users.length === 0 ? 'No users found.' : `No users match "${query}".`}
        </p>
      )}

      {status === 'success' && filteredUsers.length > 0 && (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredUsers.map((user) => (
            <li key={user.id}>
              <Link
                to={`/users/${user.id}`}
                className="flex flex-col gap-1 rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-indigo-300"
              >
                <span className="text-sm font-semibold text-gray-900">{user.name}</span>
                <span className="text-xs text-gray-500">{user.email}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default UserDirectory

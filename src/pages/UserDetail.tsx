import { Link, useParams } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import type { User } from '../types/user'

function UserDetail() {
  const { id } = useParams()
  const { data: user, loading, error } = useFetch<User>(`https://jsonplaceholder.typicode.com/users/${id}`)

  return (
    <section className="flex flex-col gap-4">
      <Link to="/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        ← Back to directory
      </Link>

      {loading && <p className="text-sm text-gray-500">Loading user…</p>}

      {!loading && error && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>
      )}

      {!loading && !error && user && (
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
          <p className="text-sm text-gray-700">{user.email}</p>
          <p className="text-sm text-gray-500">{user.company?.name}</p>
          <p className="text-sm text-gray-500">
            {user.address?.street}, {user.address?.city}
          </p>
        </div>
      )}
    </section>
  )
}

export default UserDetail

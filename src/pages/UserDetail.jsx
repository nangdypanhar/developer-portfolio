import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

function UserDetail() {
  const { id } = useParams()
  const [result, setResult] = useState({ id: null, status: 'loading', user: null, error: null })

  useEffect(() => {
    let cancelled = false

    fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`User not found (${response.status})`)
        }
        return response.json()
      })
      .then((data) => {
        if (cancelled) return
        setResult({ id, status: 'success', user: data, error: null })
      })
      .catch((err) => {
        if (cancelled) return
        setResult({ id, status: 'error', user: null, error: err instanceof Error ? err.message : 'Failed to load user.' })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const status = result.id === id ? result.status : 'loading'

  return (
    <section className="flex flex-col gap-4">
      <Link to="/users" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
        ← Back to directory
      </Link>

      {status === 'loading' && <p className="text-sm text-gray-500">Loading user…</p>}

      {status === 'error' && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{result.error}</p>
      )}

      {status === 'success' && result.user && (
        <div className="flex flex-col gap-2 rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-lg font-semibold text-gray-900">{result.user.name}</h2>
          <p className="text-sm text-gray-700">{result.user.email}</p>
          <p className="text-sm text-gray-500">{result.user.company?.name}</p>
          <p className="text-sm text-gray-500">
            {result.user.address?.street}, {result.user.address?.city}
          </p>
        </div>
      )}
    </section>
  )
}

export default UserDetail

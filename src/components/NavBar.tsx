import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

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
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link to="/habits" className="text-sm font-semibold text-gray-900">
          Habit Tracker
        </Link>
        <AuthControl />
      </div>
    </nav>
  )
}

export default NavBar

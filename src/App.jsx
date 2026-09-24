import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import NavBar from './components/NavBar'
import OfflineBanner from './components/OfflineBanner'
import ProtectedRoute from './components/ProtectedRoute'
import UpdateToast from './components/UpdateToast'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

// Split out so /login doesn't download the tracker code before you sign in.
const Habits = lazy(() => import('./pages/Habits'))

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary
        name="Navigation"
        fallback={(_error, reset) => (
          <nav className="border-b border-red-200 bg-red-50">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 text-sm text-red-700 md:px-8">
              <span>Navigation failed to load.</span>
              <button type="button" onClick={reset} className="font-medium underline">
                Try again
              </button>
            </div>
          </nav>
        )}
      >
        <NavBar />
      </ErrorBoundary>
      <OfflineBanner />
      <main className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-10">
        <ErrorBoundary name="This page">
          <Routes>
            <Route path="/" element={<Navigate to="/habits" replace />} />
            <Route
              path="/habits"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<p className="text-sm text-gray-500">Loading habits…</p>}>
                    <Habits />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <UpdateToast />
    </div>
  )
}

export default App

import { Navigate, Route, Routes } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import NavBar from './components/NavBar'
import ProtectedRoute from './components/ProtectedRoute'
import Habits from './pages/Habits'
import Login from './pages/Login'
import NotFound from './pages/NotFound'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ErrorBoundary
        name="Navigation"
        fallback={(_error, reset) => (
          <nav className="border-b border-red-200 bg-red-50">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 text-sm text-red-700 md:px-8">
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
      <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
        <ErrorBoundary name="This page">
          <Routes>
            <Route path="/" element={<Navigate to="/habits" replace />} />
            <Route
              path="/habits"
              element={
                <ProtectedRoute>
                  <Habits />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App

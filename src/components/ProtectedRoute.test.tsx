import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useAuth } from '../context/AuthContext'
import ProtectedRoute from './ProtectedRoute'

vi.mock('../context/AuthContext', () => ({ useAuth: vi.fn() }))

const mockedUseAuth = vi.mocked(useAuth)

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<p>Login page</p>} />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <p>Secret habits</p>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

function authState(overrides: Partial<ReturnType<typeof useAuth>>) {
  return { user: null, session: null, loading: false, signIn: vi.fn(), signUp: vi.fn(), signOut: vi.fn(), ...overrides }
}

describe('ProtectedRoute', () => {
  beforeEach(() => mockedUseAuth.mockReset())

  it('redirects to /login when signed out', () => {
    mockedUseAuth.mockReturnValue(authState({}))
    renderAt('/habits')
    expect(screen.getByText('Login page')).toBeInTheDocument()
    expect(screen.queryByText('Secret habits')).not.toBeInTheDocument()
  })

  it('waits instead of redirecting while the session is being restored', () => {
    mockedUseAuth.mockReturnValue(authState({ loading: true }))
    renderAt('/habits')
    expect(screen.getByText('Checking your session…')).toBeInTheDocument()
    expect(screen.queryByText('Login page')).not.toBeInTheDocument()
  })

  it('renders the page when signed in', () => {
    mockedUseAuth.mockReturnValue(authState({ user: { id: 'u1' } as never }))
    renderAt('/habits')
    expect(screen.getByText('Secret habits')).toBeInTheDocument()
  })
})

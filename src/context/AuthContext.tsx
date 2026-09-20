import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

interface AuthUser {
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  signIn: (email: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  function signIn(email: string) {
    setUser({ email })
  }

  function signOut() {
    setUser(null)
  }

  const value = useMemo(() => ({ user, signIn, signOut }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

'use client'

import * as React from 'react'
import { users, type User } from '@/lib/mock-data'

type SessionContextValue = {
  user: User | null
  ready: boolean
  login: (userId: string) => User | null
  logout: () => void
}

const SessionContext = React.createContext<SessionContextValue | null>(null)
const STORAGE_KEY = 'fitzone.session.userId'

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const found = users.find((u) => u.id === stored)
      if (found) setUser(found)
    }
    setReady(true)
  }, [])

  const login = React.useCallback((userId: string) => {
    const found = users.find((u) => u.id === userId) ?? null
    setUser(found)
    if (found) localStorage.setItem(STORAGE_KEY, found.id)
    return found
  }, [])

  const logout = React.useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = React.useMemo(
    () => ({ user, ready, login, logout }),
    [user, ready, login, logout],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession() {
  const ctx = React.useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}

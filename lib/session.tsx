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
const INACTIVE_CLIENTS_KEY = 'fitzone.inactive.clients'
const STAFF_STORAGE_KEY = 'fitzone.staff'

function isAccountActive(user: User) {
  if (typeof window === 'undefined') return true

  if (user.role === 'cliente') {
    const inactive = JSON.parse(localStorage.getItem(INACTIVE_CLIENTS_KEY) ?? '[]') as string[]
    return !inactive.includes(user.id)
  }

  if (user.role === 'empleado') {
    const staff = JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY) ?? '[]') as User[]
    const savedUser = staff.find((employee) => employee.id === user.id)
    return savedUser ? savedUser.active : user.active
  }

  return user.active
}

function resolveUser(userId: string) {
  const seededUser = users.find((user) => user.id === userId)
  if (typeof window === 'undefined') return seededUser

  if (seededUser?.role === 'empleado') {
    const staff = JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY) ?? '[]') as User[]
    return staff.find((employee) => employee.id === userId) ?? seededUser
  }

  if (seededUser) return seededUser
  const staff = JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY) ?? '[]') as User[]
  return staff.find((employee) => employee.id === userId)
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const found = resolveUser(stored)
      if (found && isAccountActive(found)) setUser(found)
      else localStorage.removeItem(STORAGE_KEY)
    }
    setReady(true)
  }, [])

  const login = React.useCallback((userId: string) => {
    const found = resolveUser(userId) ?? null
    if (found && !isAccountActive(found)) return null
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

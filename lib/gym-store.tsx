'use client'

import * as React from 'react'
import {
  users as seedUsers,
  gymClasses as seedClasses,
  changeRequests as seedRequests,
  type User,
  type GymClass,
  type ChangeRequest,
  type SubRole,
} from '@/lib/mock-data'

type GymStore = {
  staff: User[]
  clients: User[]
  classes: GymClass[]
  requests: ChangeRequest[]
  toggleEmployeeActive: (id: string) => void
  toggleClientActive: (id: string) => void
  setEmployeeSubRole: (id: string, subRole: SubRole) => void
  addEmployee: (data: { name: string; email: string; subRole: SubRole }) => void
  updateClass: (id: string, patch: Partial<GymClass>) => void
  resolveRequest: (id: string, status: 'aprobado' | 'rechazado') => void
  addRequest: (req: Omit<ChangeRequest, 'id' | 'status' | 'date'>) => void
}

const GymContext = React.createContext<GymStore | null>(null)

export function GymDataProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = React.useState<User[]>(
    seedUsers.filter((u) => u.role === 'empleado').map((u) => ({ ...u })),
  )
  const [clients, setClients] = React.useState<User[]>(() => {
    const inactive = typeof window === 'undefined' ? [] : JSON.parse(localStorage.getItem('fitzone.inactive.clients') ?? '[]') as string[]
    return seedUsers
      .filter((u) => u.role === 'cliente')
      .map((u) => ({ ...u, active: !inactive.includes(u.id) }))
  })
  const [classes, setClasses] = React.useState<GymClass[]>(seedClasses.map((c) => ({ ...c })))
  const [requests, setRequests] = React.useState<ChangeRequest[]>(
    seedRequests.map((r) => ({ ...r })),
  )

  const toggleEmployeeActive = React.useCallback((id: string) => {
    setStaff((prev) => prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e)))
  }, [])

  const toggleClientActive = React.useCallback((id: string) => {
    setClients((prev) => {
      const next = prev.map((client) => (client.id === id ? { ...client, active: !client.active } : client))
      const inactive = next.filter((client) => !client.active).map((client) => client.id)
      localStorage.setItem('fitzone.inactive.clients', JSON.stringify(inactive))
      return next
    })
  }, [])

  const setEmployeeSubRole = React.useCallback((id: string, subRole: SubRole) => {
    setStaff((prev) => prev.map((e) => (e.id === id ? { ...e, subRole } : e)))
  }, [])

  const addEmployee = React.useCallback(
    (data: { name: string; email: string; subRole: SubRole }) => {
      const initials = data.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
      setStaff((prev) => [
        ...prev,
        {
          id: `e${Date.now()}`,
          name: data.name,
          email: data.email,
          role: 'empleado',
          subRole: data.subRole,
          avatarInitials: initials || 'NN',
          active: true,
        },
      ])
    },
    [],
  )

  const updateClass = React.useCallback((id: string, patch: Partial<GymClass>) => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  }, [])

  const resolveRequest = React.useCallback((id: string, status: 'aprobado' | 'rechazado') => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }, [])

  const addRequest = React.useCallback(
    (req: Omit<ChangeRequest, 'id' | 'status' | 'date'>) => {
      setRequests((prev) => [
        {
          ...req,
          id: `cr${Date.now()}`,
          status: 'pendiente',
          date: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ])
    },
    [],
  )

  const value = React.useMemo<GymStore>(
    () => ({
      staff,
      clients,
      classes,
      requests,
      toggleEmployeeActive,
      toggleClientActive,
      setEmployeeSubRole,
      addEmployee,
      updateClass,
      resolveRequest,
      addRequest,
    }),
    [
      staff,
      clients,
      classes,
      requests,
      toggleEmployeeActive,
      toggleClientActive,
      setEmployeeSubRole,
      addEmployee,
      updateClass,
      resolveRequest,
      addRequest,
    ],
  )

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>
}

export function useGymStore() {
  const ctx = React.useContext(GymContext)
  if (!ctx) throw new Error('useGymStore must be used within GymDataProvider')
  return ctx
}

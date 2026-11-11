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
  deleteEmployee: (id: string, requesterId: string) => void
  updateClass: (id: string, patch: Partial<GymClass>) => void
  resolveRequest: (id: string, status: 'aprobado' | 'rechazado') => void
  addRequest: (req: Omit<ChangeRequest, 'id' | 'status' | 'date'>) => void
}

const GymContext = React.createContext<GymStore | null>(null)
const STAFF_STORAGE_KEY = 'fitzone.staff'
const DELETED_STAFF_KEY = 'fitzone.deleted.staff'
const CLIENTS_STORAGE_KEY = 'fitzone.inactive.clients'
const CLASSES_STORAGE_KEY = 'fitzone.classes'

export function GymDataProvider({ children }: { children: React.ReactNode }) {
  const [staff, setStaff] = React.useState<User[]>(
    seedUsers.filter((u) => u.role === 'empleado').map((u) => ({ ...u })),
  )
  const [deletedStaffIds, setDeletedStaffIds] = React.useState<string[]>([])
  const [clients, setClients] = React.useState<User[]>(
    seedUsers.filter((u) => u.role === 'cliente').map((u) => ({ ...u })),
  )
  const [classes, setClasses] = React.useState<GymClass[]>(seedClasses.map((c) => ({ ...c })))
  const [storageReady, setStorageReady] = React.useState(false)

  React.useEffect(() => {
    try {
      const deletedIds = JSON.parse(localStorage.getItem(DELETED_STAFF_KEY) ?? '[]') as string[]
      const savedStaff = JSON.parse(localStorage.getItem(STAFF_STORAGE_KEY) ?? '[]') as User[]
      const inactiveClientIds = JSON.parse(localStorage.getItem(CLIENTS_STORAGE_KEY) ?? '[]') as string[]
      const savedClasses = JSON.parse(localStorage.getItem(CLASSES_STORAGE_KEY) ?? '[]') as GymClass[]
      const deletedIdSet = new Set(deletedIds)
      const seededStaff = seedUsers.filter((user) => user.role === 'empleado' && !deletedIdSet.has(user.id))
      const seededClasses = seedClasses.map((gymClass) =>
        savedClasses.find((savedClass) => savedClass.id === gymClass.id) ?? gymClass,
      )

      setDeletedStaffIds(deletedIds)
      setStaff([
        ...seededStaff.map((seed) => savedStaff.find((user) => user.id === seed.id) ?? seed),
        ...savedStaff.filter((user) => !deletedIdSet.has(user.id) && !seededStaff.some((seed) => seed.id === user.id)),
      ])
      setClients(
        seedUsers
          .filter((user) => user.role === 'cliente')
          .map((user) => ({ ...user, active: !inactiveClientIds.includes(user.id) })),
      )
      setClasses([
        ...seededClasses,
        ...savedClasses.filter((savedClass) => !seedClasses.some((seed) => seed.id === savedClass.id)),
      ])
    } catch {
      localStorage.removeItem(STAFF_STORAGE_KEY)
      localStorage.removeItem(DELETED_STAFF_KEY)
      localStorage.removeItem(CLIENTS_STORAGE_KEY)
      localStorage.removeItem(CLASSES_STORAGE_KEY)
    }
    setStorageReady(true)
  }, [])

  React.useEffect(() => {
    if (!storageReady) return
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staff))
    localStorage.setItem(DELETED_STAFF_KEY, JSON.stringify(deletedStaffIds))
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(clients.filter((client) => !client.active).map((client) => client.id)))
    localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes))
  }, [staff, deletedStaffIds, clients, classes, storageReady])
  const [requests, setRequests] = React.useState<ChangeRequest[]>(
    seedRequests.map((r) => ({ ...r })),
  )

  const toggleEmployeeActive = React.useCallback((id: string) => {
    setStaff((prev) => prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e)))
  }, [])

  const toggleClientActive = React.useCallback((id: string) => {
    setClients((prev) => prev.map((client) => (client.id === id ? { ...client, active: !client.active } : client)))
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

  const deleteEmployee = React.useCallback((id: string, requesterId: string) => {
    const employee = staff.find((member) => member.id === id)
    if (!employee || employee.role !== 'empleado' || employee.subRole !== 'entrenador' || id === requesterId) return

    setStaff((prev) => prev.filter((member) => member.id !== id))
    setDeletedStaffIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setClasses((prev) => prev.map((gymClass) => gymClass.trainerId === id ? { ...gymClass, trainerId: '' } : gymClass))
  }, [staff])

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
      deleteEmployee,
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
      deleteEmployee,
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

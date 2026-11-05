export type Role = 'empleado' | 'cliente'
export type SubRole = 'entrenador' | 'supervisor'

export type User = {
  id: string
  name: string
  email: string
  role: Role
  subRole?: SubRole
  avatarInitials: string
  active: boolean
}

export type GymClass = {
  id: string
  name: string
  activity: string
  trainerId: string
  day: string
  start: string
  end: string
  room: string
  capacity: number
  enrolled: number
}

export type Membership = {
  clientId: string
  plan: string
  price: number
  startDate: string
  endDate: string
}

export type ChangeRequest = {
  id: string
  fromUserId: string
  fromName: string
  type: 'cliente-cambio'
  classId: string
  message: string
  status: 'pendiente' | 'aprobado' | 'rechazado'
  date: string
}

export const users: User[] = [
  { id: 't1', name: 'Lucas Fernández', email: 'lucas@fitzone.com', role: 'empleado', subRole: 'entrenador', avatarInitials: 'LF', active: true },
  { id: 't2', name: 'Sofía Ramírez', email: 'sofia@fitzone.com', role: 'empleado', subRole: 'entrenador', avatarInitials: 'SR', active: true },
  { id: 't3', name: 'Diego Ibáñez', email: 'diego@fitzone.com', role: 'empleado', subRole: 'entrenador', avatarInitials: 'DI', active: true },
  { id: 's1', name: 'Valentina Sosa', email: 'supervisor@fitzone.com', role: 'empleado', subRole: 'supervisor', avatarInitials: 'VS', active: true },
  { id: 'cl1', name: 'Julián Pérez', email: 'julian@mail.com', role: 'cliente', avatarInitials: 'JP', active: true },
  { id: 'cl2', name: 'Carla Méndez', email: 'carla@mail.com', role: 'cliente', avatarInitials: 'CM', active: true },
  { id: 'cl3', name: 'Tomás Ríos', email: 'tomas@mail.com', role: 'cliente', avatarInitials: 'TR', active: true },
  { id: 'cl4', name: 'Agustina Vega', email: 'agustina@mail.com', role: 'cliente', avatarInitials: 'AV', active: true },
  { id: 'cl5', name: 'Bruno Castro', email: 'bruno@mail.com', role: 'cliente', avatarInitials: 'BC', active: true },
]

export const gymClasses: GymClass[] = [
  { id: 'k1', name: 'Musculación AM', activity: 'Musculación', trainerId: 't1', day: 'Lunes', start: '08:00', end: '09:30', room: 'Sala de Pesas', capacity: 20, enrolled: 14 },
  { id: 'k2', name: 'Crossfit Intenso', activity: 'Crossfit', trainerId: 't2', day: 'Lunes', start: '18:00', end: '19:00', room: 'Box Crossfit', capacity: 15, enrolled: 15 },
  { id: 'k3', name: 'Pilates Reformer', activity: 'Pilates', trainerId: 't3', day: 'Martes', start: '10:00', end: '11:00', room: 'Estudio 2', capacity: 12, enrolled: 8 },
  { id: 'k4', name: 'Funcional Express', activity: 'Funcional', trainerId: 't1', day: 'Miércoles', start: '19:00', end: '20:00', room: 'Sala Funcional', capacity: 18, enrolled: 12 },
  { id: 'k5', name: 'Clase Grupal Ritmo', activity: 'Clases grupales', trainerId: 't2', day: 'Jueves', start: '20:00', end: '21:00', room: 'Estudio 1', capacity: 25, enrolled: 21 },
  { id: 'k6', name: 'Crossfit AM', activity: 'Crossfit', trainerId: 't3', day: 'Viernes', start: '07:00', end: '08:00', room: 'Box Crossfit', capacity: 15, enrolled: 9 },
]

export const memberships: Membership[] = [
  { clientId: 'cl1', plan: 'Plan Full', price: 28000, startDate: '2025-07-01', endDate: '2025-10-01' },
  { clientId: 'cl2', plan: 'Plan Básico', price: 15000, startDate: '2025-08-15', endDate: '2025-09-15' },
  { clientId: 'cl3', plan: 'Plan Premium', price: 42000, startDate: '2025-06-10', endDate: '2025-12-10' },
  { clientId: 'cl4', plan: 'Plan Full', price: 28000, startDate: '2025-08-01', endDate: '2025-09-20' },
  { clientId: 'cl5', plan: 'Plan Básico', price: 15000, startDate: '2025-08-20', endDate: '2025-11-20' },
]

export const changeRequests: ChangeRequest[] = [
  { id: 'cr2', fromUserId: 'cl3', fromName: 'Tomás Ríos (Cliente)', type: 'cliente-cambio', classId: 'k3', message: 'Quisiera cambiar mi Pilates del martes al jueves.', status: 'pendiente', date: '2025-09-06' },
]

export const plans = [
  { name: 'Plan Básico', price: 15000, features: ['Acceso a sala de musculación', 'Horario reducido (mañana)', '1 clase grupal por semana'], highlight: false },
  { name: 'Plan Full', price: 28000, features: ['Acceso completo 24/7', 'Todas las clases grupales', 'Funcional y Crossfit incluidos', 'Seguimiento mensual'], highlight: true },
  { name: 'Plan Premium', price: 42000, features: ['Todo lo del Plan Full', 'Entrenador personal 2x semana', 'Plan nutricional', 'Acceso a Pilates Reformer'], highlight: false },
]

export const scheduleTable = [
  { time: '07:00 - 09:30', mon: 'Musculación', tue: 'Funcional', wed: 'Musculación', thu: 'Crossfit', fri: 'Crossfit', sat: 'Funcional' },
  { time: '10:00 - 12:00', mon: 'Pilates', tue: 'Pilates', wed: 'Grupales', thu: 'Pilates', fri: 'Grupales', sat: 'Libre' },
  { time: '17:00 - 19:00', mon: 'Crossfit', tue: 'Funcional', wed: 'Funcional', thu: 'Musculación', fri: 'Crossfit', sat: 'Cerrado' },
  { time: '19:00 - 21:00', mon: 'Grupales', tue: 'Crossfit', wed: 'Funcional', thu: 'Grupales', fri: 'Grupales', sat: 'Cerrado' },
]

export const activities = [
  { name: 'Musculación', image: '/act-musculacion.png', description: 'Zona de pesas completa con acompañamiento profesional.' },
  { name: 'Crossfit', image: '/act-crossfit.png', description: 'Entrenamiento de alta intensidad en nuestro box equipado.' },
  { name: 'Pilates', image: '/act-pilates.png', description: 'Fortalecé tu core y mejorá tu postura con reformer.' },
  { name: 'Funcional', image: '/act-funcional.png', description: 'Movimientos que mejoran tu día a día. Pura energía.' },
  { name: 'Clases grupales', image: '/act-grupales.png', description: 'Entrená en equipo y sumá motivación extra.' },
]

export function trainerName(id: string) {
  return users.find((u) => u.id === id)?.name ?? 'Sin asignar'
}

export function clientName(id: string) {
  return users.find((u) => u.id === id)?.name ?? 'Cliente'
}

export function className_(id: string) {
  return gymClasses.find((c) => c.id === id)?.name ?? 'Clase'
}

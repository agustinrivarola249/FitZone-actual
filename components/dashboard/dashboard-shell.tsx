'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  Dumbbell,
  LayoutDashboard,
  Users,
  ClipboardCheck,
  Calendar,
  ClipboardList,
  Clock,
  Bell,
  CreditCard,
  LogOut,
  ShoppingBag,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/lib/session'
import { GymDataProvider } from '@/lib/gym-store'
import type { User } from '@/lib/mock-data'
import { SupervisorDashboard } from '@/components/dashboard/supervisor-dashboard'
import { EntrenadorDashboard } from '@/components/dashboard/entrenador-dashboard'
import { ClienteDashboard } from '@/components/dashboard/cliente-dashboard'

type NavItem = { id: string; label: string; icon: typeof LayoutDashboard; href?: string }

function getNav(user: User): NavItem[] {
  if (user.role === 'cliente') {
    return [
      { id: 'clases', label: 'Mis clases', icon: Calendar },
      { id: 'membresia', label: 'Mi membresía', icon: CreditCard },
      { id: 'horarios', label: 'Horarios de clases', icon: Clock, href: '/horarios' },
      { id: 'tienda', label: 'Tienda', icon: ShoppingBag, href: '/tienda' },
    ]
  }
  if (user.subRole === 'entrenador') {
    return [
      { id: 'clases', label: 'Mis clases', icon: Calendar },
      { id: 'sesiones', label: 'Registrar sesiones', icon: ClipboardList },
      { id: 'horarios', label: 'Horarios de clases', icon: Clock, href: '/horarios' },
      { id: 'tienda', label: 'Tienda', icon: ShoppingBag, href: '/tienda' },
    ]
  }
  // supervisor / recepcionista
  return [
    { id: 'reportes', label: 'Reportes', icon: LayoutDashboard },
    { id: 'empleados', label: 'Empleados', icon: Users },
    { id: 'aprobaciones', label: 'Aprobaciones', icon: ClipboardCheck },
    { id: 'horarios', label: 'Horarios de clases', icon: Clock, href: '/horarios' },
    { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
    { id: 'tienda', label: 'Tienda', icon: ShoppingBag, href: '/tienda' },
  ]
}

function roleLabel(user: User) {
  if (user.role === 'cliente') return 'Cliente'
  if (user.subRole === 'supervisor') return 'Supervisor / Recepción'
  return 'Entrenador'
}

function DashboardContent() {
  const { user, ready, logout } = useSession()
  const router = useRouter()
  const [section, setSection] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (ready && !user) router.replace('/login')
  }, [ready, user, router])

  const nav = React.useMemo(() => (user ? getNav(user) : []), [user])

  React.useEffect(() => {
    if (nav.length && (!section || !nav.some((n) => n.id === section))) {
      setSection(nav[0].id)
    }
  }, [nav, section])

  if (!ready || !user || !section) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Skeleton className="size-12 rounded-full" />
      </div>
    )
  }

  const activeItem = nav.find((n) => n.id === section) ?? nav[0]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="size-5" />
            </span>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold leading-none tracking-wide">
                FitZone
              </span>
              <span className="text-xs text-muted-foreground">Panel interno</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{roleLabel(user)}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={item.id === section}
                      onClick={() => item.href ? router.push(item.href) : setSection(item.id)}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-3 rounded-lg border border-sidebar-border p-2">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/15 text-primary">
                {user.avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <span className="truncate text-xs text-muted-foreground">{user.email}</span>
            </div>
            <Button variant="ghost" size="icon" aria-label="Cerrar sesión" onClick={handleLogout}>
              <LogOut />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger />
            <div className="flex flex-1 items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="font-display text-xl font-bold uppercase tracking-wide">
                {activeItem?.label}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => router.push('/horarios')}>
                <Clock data-icon="inline-start" /> Horarios
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/tienda')}>
                <ShoppingBag data-icon="inline-start" /> Tienda
              </Button>
              <Badge variant="secondary" className="capitalize">
              {roleLabel(user)}
              </Badge>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {user.role === 'cliente' && <ClienteDashboard section={section} user={user} />}
          {user.role === 'empleado' && user.subRole === 'entrenador' && (
            <EntrenadorDashboard section={section} user={user} />
          )}
          {user.role === 'empleado' && user.subRole === 'supervisor' && (
            <SupervisorDashboard section={section} />
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export function DashboardShell() {
  return (
    <GymDataProvider>
      <DashboardContent />
    </GymDataProvider>
  )
}

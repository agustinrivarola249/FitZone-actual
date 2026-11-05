'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Dumbbell,
  ClipboardCheck,
  Activity,
  User as UserIcon,
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useSession } from '@/lib/session'
import { users, type Role, type SubRole } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

type RoleOption = {
  key: 'cliente' | 'entrenador' | 'supervisor'
  role: Role
  subRole?: SubRole
  label: string
  desc: string
  icon: typeof ClipboardCheck
}

const roleOptions: RoleOption[] = [
  { key: 'cliente', role: 'cliente', label: 'Cliente', desc: 'Tus clases y tu membresía', icon: UserIcon },
  { key: 'entrenador', role: 'empleado', subRole: 'entrenador', label: 'Entrenador', desc: 'Tus clases y registro de sesiones', icon: Activity },
  { key: 'supervisor', role: 'empleado', subRole: 'supervisor', label: 'Supervisor / Recepción', desc: 'Reportes, empleados, aprobaciones y horarios', icon: ClipboardCheck },
]

export default function LoginPage() {
  const router = useRouter()
  const { login } = useSession()
  const [selected, setSelected] = React.useState<RoleOption | null>(null)
  const [loginError, setLoginError] = React.useState('')

  const candidates = React.useMemo(() => {
    if (!selected) return []
    return users.filter(
      (u) => u.role === selected.role && (!selected.subRole || u.subRole === selected.subRole),
    )
  }, [selected])

  const handleLogin = (userId: string) => {
    const loggedUser = login(userId)
    if (!loggedUser) {
      setLoginError('Tu cuenta está dada de baja. Contacta al gimnasio para reactivarla.')
      return
    }
    setLoginError('')
    const returnTo = new URLSearchParams(window.location.search).get('returnTo')
    router.push(returnTo || '/dashboard')
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div
        className="relative hidden bg-cover bg-center lg:block"
        style={{ backgroundImage: 'url(/hero-gym.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 flex flex-col justify-between p-10">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="size-5" />
            </span>
            <span className="font-display text-2xl font-bold tracking-wide">FitZone</span>
          </Link>
          <div>
            <h2 className="font-display text-5xl font-bold uppercase leading-none tracking-tight text-balance">
              Tu entrenamiento,
              <br />
              tu espacio.
            </h2>
            <p className="mt-4 max-w-sm text-muted-foreground">
              Ingresá al sistema interno de FitZone según tu rol.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>

          <h1 className="font-display text-3xl font-bold uppercase tracking-tight">
            Iniciar sesión
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Elegí tu rol para acceder al panel correspondiente.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {roleOptions.map((opt) => {
              const isSelected = selected?.key === opt.key
              return (
                <button
                  key={opt.key}
                  onClick={() => setSelected(opt)}
                  className={cn(
                    'flex items-center gap-4 rounded-xl border p-4 text-left transition-colors',
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:border-primary/50',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-11 shrink-0 items-center justify-center rounded-lg',
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground',
                    )}
                  >
                    <opt.icon className="size-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-semibold">{opt.label}</span>
                    <span className="block text-sm text-muted-foreground">{opt.desc}</span>
                  </span>
                  {isSelected && <Check className="size-5 text-primary" />}
                </button>
              )
            })}
          </div>

          {loginError && (
            <p role="alert" className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {loginError}
            </p>
          )}

          {selected && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Cuenta de demostración</p>
              <div className="flex flex-col gap-2">
                {candidates.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleLogin(u.id)}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary"
                  >
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-primary/15 text-primary">
                        {u.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{u.name}</span>
                      <span className="block text-xs text-muted-foreground">{u.email}</span>
                    </span>
                    {u.subRole && (
                      <Badge variant="secondary" className="capitalize">
                        {u.subRole}
                      </Badge>
                    )}
                    <ArrowRight className="size-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Demo: seleccioná una cuenta para entrar directamente. No se requiere contraseña.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

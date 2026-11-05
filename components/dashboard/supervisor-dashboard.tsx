'use client'

import * as React from 'react'
import {
  DollarSign,
  Users,
  Activity,
  TrendingUp,
  UserPlus,
  Check,
  X,
  Bell,
  Send,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useGymStore } from '@/lib/gym-store'
import { memberships, className_, trainerName, type SubRole } from '@/lib/mock-data'
import { ClassEditDialog } from '@/components/dashboard/class-edit-dialog'

const currency = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string
  hint: string
  icon: typeof DollarSign
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 pb-2">
        <CardDescription>{label}</CardDescription>
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-4" />
        </span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  )
}

function Reportes() {
  const { classes, clients } = useGymStore()

  const ingresos = memberships.reduce((sum, m) => sum + m.price, 0)
  const asistencia = classes.reduce((sum, c) => sum + c.enrolled, 0)
  const ocupacion = Math.round(
    (classes.reduce((sum, c) => sum + c.enrolled / c.capacity, 0) / classes.length) * 100,
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Ingresos del mes"
          value={`$${currency.format(ingresos)}`}
          hint="Membresías activas"
          icon={DollarSign}
        />
        <StatCard
          label="Clientes activos"
          value={String(clients.length)}
          hint="Con membresía vigente"
          icon={Users}
        />
        <StatCard
          label="Asistencia hoy"
          value={String(asistencia)}
          hint="Inscriptos en clases"
          icon={Activity}
        />
        <StatCard
          label="Ocupación media"
          value={`${ocupacion}%`}
          hint="Promedio de todas las clases"
          icon={TrendingUp}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ocupación por clase</CardTitle>
            <CardDescription>Inscriptos sobre cupo disponible</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {classes.map((c) => {
              const pct = Math.round((c.enrolled / c.capacity) * 100)
              return (
                <div key={c.id} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">
                      {c.enrolled}/{c.capacity} · {pct}%
                    </span>
                  </div>
                  <Progress value={pct} />
                </div>
              )
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ingresos por plan</CardTitle>
            <CardDescription>Distribución de membresías</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {Object.entries(
              memberships.reduce<Record<string, { count: number; total: number }>>((acc, m) => {
                acc[m.plan] = acc[m.plan] ?? { count: 0, total: 0 }
                acc[m.plan].count += 1
                acc[m.plan].total += m.price
                return acc
              }, {}),
            ).map(([plan, data]) => (
              <div
                key={plan}
                className="flex items-center justify-between rounded-lg border border-border p-3"
              >
                <div>
                  <p className="font-medium">{plan}</p>
                  <p className="text-xs text-muted-foreground">{data.count} clientes</p>
                </div>
                <span className="font-semibold text-primary">
                  ${currency.format(data.total)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const subRoles: SubRole[] = ['entrenador', 'supervisor']

function Empleados() {
  const { staff, toggleEmployeeActive, setEmployeeSubRole, addEmployee } = useGymStore()
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [subRole, setSubRole] = React.useState<SubRole>('entrenador')

  const handleAdd = () => {
    if (!name.trim() || !email.trim()) {
      toast.error('Completá nombre y email')
      return
    }
    addEmployee({ name: name.trim(), email: email.trim(), subRole })
    toast.success(`${name} dado de alta como ${subRole}`)
    setName('')
    setEmail('')
    setSubRole('entrenador')
    setOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <div>
          <CardTitle>Gestión de empleados</CardTitle>
          <CardDescription>Alta, baja y asignación de sub-rol</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button>
                <UserPlus data-icon="inline-start" />
                Alta empleado
              </Button>
            }
          />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nuevo empleado</DialogTitle>
              <DialogDescription>Registrá un nuevo miembro del equipo.</DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="emp-name">Nombre completo</FieldLabel>
                <Input id="emp-name" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field>
                <FieldLabel htmlFor="emp-email">Email</FieldLabel>
                <Input
                  id="emp-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Sub-rol</FieldLabel>
                <Select value={subRole} onValueChange={(v) => setSubRole(v as SubRole)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {subRoles.map((r) => (
                        <SelectItem key={r} value={r} className="capitalize">
                          {r}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancelar</Button>} />
              <Button onClick={handleAdd}>Dar de alta</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empleado</TableHead>
                <TableHead>Sub-rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-primary/15 text-primary text-xs">
                          {emp.avatarInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">{emp.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={emp.subRole}
                      onValueChange={(v) => {
                        setEmployeeSubRole(emp.id, v as SubRole)
                        toast.success(`${emp.name} ahora es ${v}`)
                      }}
                    >
                      <SelectTrigger size="sm" className="w-36 capitalize">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {subRoles.map((r) => (
                            <SelectItem key={r} value={r} className="capitalize">
                              {r}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Badge variant={emp.active ? 'default' : 'secondary'}>
                      {emp.active ? 'Activo' : 'Baja'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={emp.active ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => {
                        toggleEmployeeActive(emp.id)
                        toast.success(
                          emp.active ? `${emp.name} dado de baja` : `${emp.name} reactivado`,
                        )
                      }}
                    >
                      {emp.active ? 'Dar de baja' : 'Reactivar'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function Aprobaciones() {
  const { requests, resolveRequest } = useGymStore()
  const pending = requests.filter((r) => r.status === 'pendiente')
  const resolved = requests.filter((r) => r.status !== 'pendiente')

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Cambios solicitados</CardTitle>
          <CardDescription>
            Solicitudes de clientes que requieren tu aprobación.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {pending.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No hay solicitudes pendientes.
            </p>
          )}
          {pending.map((r) => (
            <div
              key={r.id}
              className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{r.fromName}</p>
                  <Badge variant="secondary">{className_(r.classId)}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{r.message}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    resolveRequest(r.id, 'aprobado')
                    toast.success('Solicitud aprobada')
                  }}
                >
                  <Check data-icon="inline-start" />
                  Aprobar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => {
                    resolveRequest(r.id, 'rechazado')
                    toast.success('Solicitud rechazada')
                  }}
                >
                  <X data-icon="inline-start" />
                  Rechazar
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {resolved.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historial</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {resolved.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 text-sm"
              >
                <span>
                  {r.fromName} · {className_(r.classId)}
                </span>
                <Badge variant={r.status === 'aprobado' ? 'default' : 'destructive'}>
                  {r.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Horarios() {
  const { classes } = useGymStore()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Horarios de clases</CardTitle>
        <CardDescription>
          Como supervisor podés editar horarios, cupos y actividades directamente.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clase</TableHead>
                <TableHead>Entrenador</TableHead>
                <TableHead>Día</TableHead>
                <TableHead>Horario</TableHead>
                <TableHead>Sala</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{trainerName(c.trainerId)}</TableCell>
                  <TableCell>{c.day}</TableCell>
                  <TableCell>
                    {c.start} - {c.end}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.room}</TableCell>
                  <TableCell className="text-right">
                    <ClassEditDialog gymClass={c} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function Recordatorios() {
  const { classes, clients } = useGymStore()
  const [clientId, setClientId] = React.useState('')
  const [classId, setClassId] = React.useState('')
  const [sent, setSent] = React.useState<{ id: string; text: string; time: string }[]>([])

  const handleSend = () => {
    if (!clientId || !classId) {
      toast.error('Elegí cliente y clase')
      return
    }
    const client = clients.find((c) => c.id === clientId)
    const cls = classes.find((c) => c.id === classId)
    setSent((prev) => [
      {
        id: `rm${Date.now()}`,
        text: `Recordatorio a ${client?.name}: ${cls?.name} (${cls?.day} ${cls?.start})`,
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
      },
      ...prev,
    ])
    toast.success(`Recordatorio enviado a ${client?.name}`)
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Enviar recordatorio</CardTitle>
          <CardDescription>Avisá a un cliente sobre su próxima clase.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel>Cliente</FieldLabel>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccioná un cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Clase</FieldLabel>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccioná una clase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {classes.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Button onClick={handleSend}>
              <Send data-icon="inline-start" />
              Enviar recordatorio
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Enviados</CardTitle>
          <CardDescription>Recordatorios de esta sesión</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {sent.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-8 text-center">
              <Bell className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Sin recordatorios enviados aún.</p>
            </div>
          )}
          {sent.map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
              <p className="text-sm">{s.text}</p>
              <span className="shrink-0 text-xs text-muted-foreground">{s.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function SupervisorDashboard({ section }: { section: string }) {
  if (section === 'empleados') return <Empleados />
  if (section === 'aprobaciones') return <Aprobaciones />
  if (section === 'horarios') return <Horarios />
  if (section === 'recordatorios') return <Recordatorios />
  return <Reportes />
}

'use client'

import * as React from 'react'
import { Clock, Users, ClipboardList, Plus } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { toast } from 'sonner'
import { useGymStore } from '@/lib/gym-store'
import type { User } from '@/lib/mock-data'
import { ClassEditDialog } from '@/components/dashboard/class-edit-dialog'

type Session = { id: string; clientId: string; classId: string; date: string; notes: string }

function MisClases({ user }: { user: User }) {
  const { classes } = useGymStore()
  const mine = classes.filter((c) => c.trainerId === user.id)

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Gestioná tus clases y sesiones. Podés modificar horario, cupo y tipo de actividad.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mine.map((c) => (
          <Card key={c.id}>
            <CardHeader className="flex-row items-start justify-between gap-2">
              <div>
                <CardTitle>{c.name}</CardTitle>
                <CardDescription>
                  {c.day} · {c.room}
                </CardDescription>
              </div>
              <Badge variant="secondary">{c.activity}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-4 text-primary" />
                  {c.start} - {c.end}
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="size-4 text-primary" />
                  {c.enrolled}/{c.capacity} inscriptos
                </span>
              </div>
              <ClassEditDialog gymClass={c} />
            </CardContent>
          </Card>
        ))}
        {mine.length === 0 && (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No tenés clases asignadas.
          </p>
        )}
      </div>
    </div>
  )
}

function RegistrarSesiones({ user }: { user: User }) {
  const { classes, clients } = useGymStore()
  const mine = classes.filter((c) => c.trainerId === user.id)
  const [clientId, setClientId] = React.useState('')
  const [classId, setClassId] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [sessions, setSessions] = React.useState<Session[]>([])

  const handleRegister = () => {
    if (!clientId || !classId) {
      toast.error('Elegí cliente y clase')
      return
    }
    setSessions((prev) => [
      {
        id: `s${Date.now()}`,
        clientId,
        classId,
        date: new Date().toLocaleDateString('es-AR'),
        notes,
      },
      ...prev,
    ])
    toast.success('Sesión registrada')
    setNotes('')
  }

  const clientName = (id: string) => clients.find((c) => c.id === id)?.name ?? 'Cliente'
  const classNameOf = (id: string) => mine.find((c) => c.id === id)?.name ?? 'Clase'

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Registrar sesión</CardTitle>
          <CardDescription>Dejá constancia de una sesión realizada con un cliente.</CardDescription>
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
                    {mine.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="notes">Notas</FieldLabel>
              <Input
                id="notes"
                placeholder="Observaciones de la sesión"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </Field>
            <Button onClick={handleRegister}>
              <Plus data-icon="inline-start" />
              Registrar sesión
            </Button>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sesiones registradas</CardTitle>
          <CardDescription>Historial de esta jornada</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {sessions.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-8 text-center">
              <ClipboardList className="size-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Todavía no registraste sesiones hoy.
              </p>
            </div>
          )}
          {sessions.map((s) => (
            <div key={s.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="font-medium">{clientName(s.clientId)}</p>
                <span className="text-xs text-muted-foreground">{s.date}</span>
              </div>
              <p className="text-sm text-muted-foreground">{classNameOf(s.classId)}</p>
              {s.notes && <p className="mt-1 text-sm">{s.notes}</p>}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function EntrenadorDashboard({ section, user }: { section: string; user: User }) {
  if (section === 'sesiones') return <RegistrarSesiones user={user} />
  return <MisClases user={user} />
}

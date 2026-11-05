'use client'

import * as React from 'react'
import { Clock, Users, CalendarClock, CreditCard, Check, RefreshCw } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { useGymStore } from '@/lib/gym-store'
import { memberships, plans, trainerName, type User } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const DEMO_TODAY = new Date('2025-09-07')
const currency = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 })

function RequestChangeDialog({ classId, className }: { classId: string; className: string }) {
  const { addRequest } = useGymStore()
  const [open, setOpen] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const handleSubmit = () => {
    if (!message.trim()) {
      toast.error('Contanos qué cambio necesitás')
      return
    }
    addRequest({
      fromUserId: 'client',
      fromName: 'Cliente',
      type: 'cliente-cambio',
      classId,
      message: message.trim(),
    })
    toast.success('Solicitud enviada al entrenador y recepción')
    setMessage('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <RefreshCw data-icon="inline-start" />
            Solicitar cambio
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitar cambio · {className}</DialogTitle>
          <DialogDescription>
            Tu pedido se notifica al entrenador y a recepción. No modifica la clase directamente.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="change-msg">¿Qué necesitás?</FieldLabel>
            <Input
              id="change-msg"
              placeholder="Ej: cambiar al turno de la tarde"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Button onClick={handleSubmit}>Enviar solicitud</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function MisClases() {
  const { classes } = useGymStore()
  const mySchedule = classes.filter((c) => ['k1', 'k3', 'k5'].includes(c.id))

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Estas son tus clases de la semana. Podés pedir un cambio y lo revisará tu entrenador.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mySchedule.map((c) => (
          <Card key={c.id}>
            <CardHeader className="flex-row items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base">{c.name}</CardTitle>
                <CardDescription>{c.day}</CardDescription>
              </div>
              <Badge variant="secondary">{c.activity}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4 text-primary" />
                  {c.start} - {c.end}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="size-4 text-primary" />
                  Con {trainerName(c.trainerId)}
                </span>
              </div>
              <RequestChangeDialog classId={c.id} className={c.name} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Membresia({ user }: { user: User }) {
  const base = memberships.find((m) => m.clientId === user.id) ?? memberships[0]
  const [plan, setPlan] = React.useState(base.plan)
  const [price, setPrice] = React.useState(base.price)

  const end = new Date(base.endDate)
  const start = new Date(base.startDate)
  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000)
  const daysLeft = Math.max(
    0,
    Math.round((end.getTime() - DEMO_TODAY.getTime()) / 86400000),
  )
  const elapsedPct = Math.min(100, Math.max(0, Math.round(((totalDays - daysLeft) / totalDays) * 100)))
  const expiringSoon = daysLeft <= 15

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-start justify-between gap-2">
          <div>
            <CardDescription>Plan actual</CardDescription>
            <CardTitle className="mt-1 text-2xl">{plan}</CardTitle>
          </div>
          <Badge variant={expiringSoon ? 'destructive' : 'default'}>
            {expiringSoon ? 'Por vencer' : 'Vigente'}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarClock className="size-4 text-primary" />
                <span className="text-sm">Días restantes</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{daysLeft}</p>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CreditCard className="size-4 text-primary" />
                <span className="text-sm">Cuota mensual</span>
              </div>
              <p className="mt-2 text-3xl font-bold">${currency.format(price)}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso del período</span>
              <span className="font-medium">
                Vence el {end.toLocaleDateString('es-AR')}
              </span>
            </div>
            <Progress value={elapsedPct} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar de plan</CardTitle>
          <CardDescription>Elegí el plan que mejor se adapte a vos.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((p) => {
              const active = p.name === plan
              return (
                <div
                  key={p.name}
                  className={cn(
                    'flex flex-col rounded-xl border p-4',
                    active ? 'border-primary bg-primary/5' : 'border-border',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold uppercase tracking-wide">
                      {p.name}
                    </h3>
                    {active && <Check className="size-4 text-primary" />}
                  </div>
                  <p className="mt-1 text-2xl font-bold">${currency.format(p.price)}</p>
                  <ul className="mt-3 flex flex-1 flex-col gap-1.5 text-sm text-muted-foreground">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f}>· {f}</li>
                    ))}
                  </ul>
                  <Button
                    className="mt-4"
                    variant={active ? 'outline' : 'default'}
                    size="sm"
                    disabled={active}
                    onClick={() => {
                      setPlan(p.name)
                      setPrice(p.price)
                      toast.success(`Cambiaste al ${p.name}`)
                    }}
                  >
                    {active ? 'Plan actual' : 'Elegir plan'}
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ClienteDashboard({ section, user }: { section: string; user: User }) {
  if (section === 'membresia') return <Membresia user={user} />
  return <MisClases />
}

'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useSession } from '@/lib/session'
import { gymClasses, trainerName } from '@/lib/mock-data'

export default function HorariosPage() {
  const router = useRouter()
  const { user, ready } = useSession()

  React.useEffect(() => {
    if (ready && !user) router.replace('/login')
  }, [ready, user, router])

  if (!ready || !user) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Skeleton className="size-12 rounded-full" /></div>
  }

  const backHref = '/dashboard'

  return (
    <main className="min-h-screen bg-background px-4 pb-12 pt-24">
      <div className="mx-auto max-w-6xl">
        <Link href={backHref} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver
        </Link>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary"><CalendarDays className="size-4" /> Agenda FitZone</p>
            <h1 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">Horarios de clases</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">Consultá clase, entrenador, día, hora y sala desde tu cuenta FitZone.</p>
          </div>
          <Badge variant="secondary">{user.subRole === 'supervisor' ? 'Supervisor / Recepción' : user.subRole === 'entrenador' ? 'Entrenador' : 'Cliente'}</Badge>
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="px-5 py-4">Clase</th><th className="px-5 py-4">Entrenador</th><th className="px-5 py-4">Día</th><th className="px-5 py-4">Hora</th><th className="px-5 py-4">Sala</th></tr>
              </thead>
              <tbody className="divide-y divide-border">
                {gymClasses.map((item) => <tr key={item.id} className="transition-colors hover:bg-muted/30"><td className="px-5 py-4 font-semibold">{item.name}<span className="mt-1 block text-xs font-normal text-muted-foreground">{item.activity}</span></td><td className="px-5 py-4">{trainerName(item.trainerId)}</td><td className="px-5 py-4">{item.day}</td><td className="px-5 py-4 whitespace-nowrap">{item.start} – {item.end}</td><td className="px-5 py-4 text-muted-foreground">{item.room}</td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  )
}

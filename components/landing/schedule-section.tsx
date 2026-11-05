import { scheduleTable } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

const days = [
  { key: 'mon', label: 'Lun' },
  { key: 'tue', label: 'Mar' },
  { key: 'wed', label: 'Mié' },
  { key: 'thu', label: 'Jue' },
  { key: 'fri', label: 'Vie' },
  { key: 'sat', label: 'Sáb' },
] as const

export function ScheduleSection() {
  return (
    <section id="horarios" className="border-y border-border bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-widest text-primary">
            Horarios
          </span>
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-balance md:text-5xl">
            Grilla semanal
          </h2>
          <p className="max-w-xl text-muted-foreground text-pretty">
            Encontrá tu horario ideal. Abierto de lunes a sábado.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-4 text-left font-display text-base font-semibold uppercase tracking-wide">
                  Horario
                </th>
                {days.map((d) => (
                  <th key={d.key} className="p-4 text-center font-display text-base font-semibold uppercase tracking-wide">
                    {d.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {scheduleTable.map((row) => (
                <tr key={row.time} className="border-t border-border">
                  <td className="whitespace-nowrap p-4 font-medium text-muted-foreground">
                    {row.time}
                  </td>
                  {days.map((d) => {
                    const value = row[d.key]
                    const off = value === 'Cerrado' || value === 'Libre'
                    return (
                      <td key={d.key} className="p-3 text-center">
                        <span
                          className={cn(
                            'inline-block rounded-md px-2.5 py-1 text-xs font-medium',
                            off
                              ? 'text-muted-foreground/60'
                              : 'bg-primary/12 text-primary',
                          )}
                        >
                          {value}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

import { activities } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export function ActivitiesSection() {
  return (
    <section id="actividades" className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
      <div className="flex flex-col gap-3">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Actividades
        </span>
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-balance md:text-5xl">
          Elegí cómo entrenar
        </h2>
        <p className="max-w-xl text-muted-foreground text-pretty">
          Disciplinas para todos los niveles, con entrenadores que te acompañan en cada paso.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {activities.map((activity, i) => (
          <article
            key={activity.name}
            className={cn(
              'group relative overflow-hidden rounded-2xl border border-border',
              i === 0 && 'sm:col-span-2 lg:col-span-2',
            )}
          >
            <div
              className="aspect-[16/10] w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${activity.image})` }}
              role="img"
              aria-label={activity.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="font-display text-2xl font-bold uppercase tracking-wide">
                {activity.name}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                {activity.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

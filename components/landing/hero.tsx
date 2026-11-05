'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const slides = [
  {
    title: 'Rompé la rutina',
    subtitle: 'Tu mejor versión empieza cuando decidís moverte. Hoy es el día.',
    image: '/hero-gym.png',
  },
  {
    title: 'Empezá hoy',
    subtitle: 'Sin excusas. Sumate a la comunidad FitZone y transformá tu energía.',
    image: '/act-crossfit.png',
  },
  {
    title: 'Superate',
    subtitle: 'Cada repetición cuenta. Vamos a por ese objetivo, juntos.',
    image: '/act-funcional.png',
  },
]

export function Hero() {
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={slide.title}
          aria-hidden={i !== current}
          className={cn(
            'absolute inset-0 bg-cover bg-center transition-opacity duration-1000',
            i === current ? 'opacity-100' : 'opacity-0',
          )}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Zap className="size-4" />
            Gimnasio FitZone
          </span>
          <h1 className="mt-6 font-display text-6xl font-bold uppercase leading-[0.95] tracking-tight text-balance sm:text-7xl md:text-8xl">
            {slides[current].title}
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground text-pretty">
            {slides[current].subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#planes"
              className={cn(buttonVariants(), 'h-12 rounded-xl px-8 text-base font-semibold')}
            >
              Sumate ahora
              <ArrowRight data-icon="inline-end" />
            </a>
            <a
              href="#actividades"
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'h-12 rounded-xl px-8 text-base font-semibold',
              )}
            >
              Ver actividades
            </a>
          </div>

          <div className="mt-10 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                aria-label={`Ir a la diapositiva ${i + 1}`}
                onClick={() => setCurrent(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === current ? 'w-10 bg-primary' : 'w-4 bg-muted-foreground/40',
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import { Check, MessageCircle } from 'lucide-react'
import { plans } from '@/lib/mock-data'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const WHATSAPP = 'https://wa.me/5491100000000?text=Hola%20FitZone,%20quiero%20info%20sobre%20un%20plan'

function formatPrice(price: number) {
  return new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(price)
}

export function PlansSection() {
  return (
    <section id="planes" className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="text-sm font-semibold uppercase tracking-widest text-primary">
          Membresías
        </span>
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight text-balance md:text-5xl">
          Elegí tu plan
        </h2>
        <p className="max-w-xl text-muted-foreground text-pretty">
          Precios claros, sin sorpresas. Cancelá cuando quieras.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              'relative flex flex-col rounded-2xl border p-6',
              plan.highlight
                ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                : 'border-border bg-card',
            )}
          >
            {plan.highlight && (
              <Badge className="absolute -top-3 left-6">Más elegido</Badge>
            )}
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide">
              {plan.name}
            </h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-4xl font-bold">${formatPrice(plan.price)}</span>
              <span className="mb-1 text-sm text-muted-foreground">/mes</span>
            </div>
            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Check className="size-3" />
                  </span>
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: plan.highlight ? 'default' : 'outline' }),
                'mt-6 h-11 rounded-xl text-base font-semibold',
              )}
            >
              <MessageCircle data-icon="inline-start" />
              Consultanos
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

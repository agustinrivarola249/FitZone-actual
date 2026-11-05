import Link from 'next/link'
import { Dumbbell, Camera, Share2, Send, MapPin, MessageCircle, Phone } from 'lucide-react'

const quickLinks = [
  { href: '#actividades', label: 'Actividades' },
  { href: '#horarios', label: 'Horarios' },
  { href: '#planes', label: 'Planes' },
  { href: '/login', label: 'Iniciar sesión' },
]

const socials = [
  { href: 'https://instagram.com', label: 'Instagram', icon: Camera },
  { href: 'https://facebook.com', label: 'Facebook', icon: Share2 },
  { href: 'https://youtube.com', label: 'YouTube', icon: Send },
]

export function SiteFooter() {
  return (
    <footer id="contacto" className="border-t border-border bg-card/40">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Dumbbell className="size-5" />
            </span>
            <span className="font-display text-2xl font-bold tracking-wide">FitZone</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground text-pretty">
            Más que un gimnasio, una comunidad. Vení a entrenar, quedate por la energía.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <s.icon className="size-5" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold uppercase tracking-wide">Links</h3>
          <ul className="mt-4 flex flex-col gap-2">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-muted-foreground hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg font-semibold uppercase tracking-wide">Contacto</h3>
          <ul className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              Av. Siempre Activa 1234, Buenos Aires
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" />
              (011) 4000-0000
            </li>
            <li>
              <a
                href="https://wa.me/5491100000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-foreground"
              >
                <MessageCircle className="size-4 shrink-0 text-primary" />
                WhatsApp: +54 9 11 0000-0000
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FitZone. Todos los derechos reservados.
      </div>
    </footer>
  )
}

'use client'

import * as React from 'react'
import Image from 'next/image'
import { Check, ChevronRight, ShoppingBag, Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useSession } from '@/lib/session'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'

type Category = 'Todos' | 'Suplementos' | 'Equipo deportivo' | 'Accesorios' | 'Ropa y bebidas'

type Product = {
  id: number
  name: string
  description: string
  category: Exclude<Category, 'Todos'>
  price: number
  stock: number
  image: string
  popular?: boolean
}

const products: Product[] = [
  { id: 1, name: 'Creatina monohidratada', description: 'Pureza premium para mejorar tu fuerza y rendimiento.', category: 'Suplementos', price: 24900, stock: 12, image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=700&q=85', popular: true },
  { id: 2, name: 'Whey Protein 1 kg', description: 'Proteína de suero sabor chocolate, rápida absorción.', category: 'Suplementos', price: 38900, stock: 8, image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=700&q=85', popular: true },
  { id: 3, name: 'Pre-entreno Focus', description: 'Energía sostenida para entrenamientos más intensos.', category: 'Suplementos', price: 21900, stock: 15, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=85' },
  { id: 4, name: 'Kettlebell 12 kg', description: 'Hierro fundido con agarre cómodo y seguro.', category: 'Equipo deportivo', price: 42900, stock: 5, image: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=700&q=85', popular: true },
  { id: 5, name: 'Mancuernas hexagonales', description: 'Par de mancuernas de 10 kg para fuerza y funcional.', category: 'Equipo deportivo', price: 55900, stock: 4, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=85' },
  { id: 6, name: 'Colchoneta Pro', description: 'Superficie antideslizante para yoga, movilidad y suelo.', category: 'Equipo deportivo', price: 19900, stock: 10, image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?auto=format&fit=crop&w=700&q=85' },
  { id: 7, name: 'Straps de levantamiento', description: 'Mejorá tu agarre y entrená con más confianza.', category: 'Accesorios', price: 8900, stock: 18, image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=700&q=85', popular: true },
  { id: 8, name: 'Botella térmica FitZone', description: '750 ml, acero inoxidable y mantiene el frío.', category: 'Accesorios', price: 12900, stock: 22, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85' },
  { id: 9, name: 'Bandas de resistencia', description: 'Set de 5 niveles para activar, fortalecer y elongar.', category: 'Accesorios', price: 14900, stock: 14, image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?auto=format&fit=crop&w=700&q=85' },
  { id: 10, name: 'Remera FitZone', description: 'Tela liviana y respirable para cada entrenamiento.', category: 'Ropa y bebidas', price: 17900, stock: 20, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=85' },
  { id: 11, name: 'Bebida isotónica', description: 'Hidratación y minerales para acompañar tu sesión.', category: 'Ropa y bebidas', price: 3900, stock: 30, image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=700&q=85' },
  { id: 12, name: 'Gorra deportiva', description: 'Visera curva y ajuste regulable para tus días activos.', category: 'Ropa y bebidas', price: 9900, stock: 11, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=700&q=85' },
]

const categories: { label: Category; detail: string }[] = [
  { label: 'Todos', detail: 'Ver todo' },
  { label: 'Suplementos', detail: 'Nutrición deportiva' },
  { label: 'Equipo deportivo', detail: 'Entrená mejor' },
  { label: 'Accesorios', detail: 'Pequeños grandes aliados' },
  { label: 'Ropa y bebidas', detail: 'Tu estilo, tu energía' },
]

const formatPrice = (price: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(price)

export default function StorePage() {
  const [category, setCategory] = React.useState<Category>('Todos')
  const [inventory, setInventory] = React.useState(products)
  const [selected, setSelected] = React.useState<Product | null>(null)
  const [quantity, setQuantity] = React.useState(1)
  const [buyer, setBuyer] = React.useState('')
  const [payment, setPayment] = React.useState('Efectivo')
  const [success, setSuccess] = React.useState(false)
  const { user } = useSession()
  const router = useRouter()

  const filteredProducts = inventory.filter((product) => category === 'Todos' || product.category === category)
  const bestSellers = inventory.filter((product) => product.popular && product.stock > 0)

  const openPurchase = (product: Product) => {
    if (!user) {
      router.push('/login?returnTo=/tienda')
      return
    }
    setSelected(product)
    setQuantity(1)
    setBuyer('')
    setSuccess(false)
  }

  const confirmPurchase = () => {
    if (!selected || !buyer.trim()) return
    setInventory((items) => items.map((item) => item.id === selected.id ? { ...item, stock: item.stock - quantity } : item))
    setSuccess(true)
  }

  return (
    <main className="min-h-screen bg-background pt-16">
      <section className="border-b border-border bg-card/60">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-12 sm:pb-14 sm:pt-16">
          <div className="max-w-2xl">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary"><Sparkles className="size-4" /> FitZone Store</p>
            <h1 className="font-display text-5xl font-bold uppercase leading-[0.95] tracking-tight sm:text-7xl">Todo lo que necesitás para <span className="text-primary">superarte.</span></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">Equipá tu entrenamiento con productos seleccionados por nuestro equipo. Comprá en el gimnasio, sin vueltas.</p>
          </div>
        </div>
      </section>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Volver</Link>
        {!user && <div className="mb-8 flex flex-col gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between"><span>Inicia sesión como miembro del gimnasio para comprar.</span><Button size="sm" onClick={() => router.push('/login?returnTo=/tienda')}>Iniciar sesión</Button></div>}
        <div className="mb-10 flex gap-3 overflow-x-auto pb-2" aria-label="Categorías de productos">
          {categories.map((item) => (
            <button key={item.label} onClick={() => setCategory(item.label)} className={cn('min-w-max rounded-xl border px-4 py-3 text-left transition-colors', category === item.label ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:border-primary/50')}>
              <span className="block text-sm font-semibold">{item.label}</span><span className={cn('mt-0.5 block text-xs', category === item.label ? 'text-primary-foreground/75' : 'text-muted-foreground')}>{item.detail}</span>
            </button>
          ))}
        </div>

        {category === 'Todos' && (
          <section className="mb-12">
            <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Lo que todos eligen</p><h2 className="mt-1 font-display text-3xl font-bold uppercase sm:text-4xl">Productos más vendidos</h2></div><span className="hidden text-sm text-muted-foreground sm:block">Selección FitZone</span></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{bestSellers.map((product) => <ProductCard key={product.id} product={product} onBuy={openPurchase} canBuy={Boolean(user)} />)}</div>
          </section>
        )}

        <section>
          <div className="mb-5 flex items-end justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{category === 'Todos' ? 'Explorá el catálogo' : 'Catálogo'}</p><h2 className="mt-1 font-display text-3xl font-bold uppercase sm:text-4xl">{category === 'Todos' ? 'Todos los productos' : category}</h2></div><span className="text-sm text-muted-foreground">{filteredProducts.length} productos</span></div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onBuy={openPurchase} canBuy={Boolean(user)} />)}</div>
        </section>
      </div>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {selected && !success && <>
            <SheetHeader className="border-b border-border pb-5"><SheetTitle className="font-display text-3xl uppercase">Comprar producto</SheetTitle><SheetDescription>Completá tus datos para reservarlo en FitZone.</SheetDescription></SheetHeader>
            <div className="space-y-6 p-4"><div className="flex items-center gap-4 rounded-xl bg-muted/50 p-3"><div className="relative size-20 overflow-hidden rounded-lg"><Image src={selected.image} alt="" fill className="object-cover" sizes="80px" /></div><div><p className="font-semibold">{selected.name}</p><p className="text-sm text-primary">{formatPrice(selected.price)}</p><p className="text-xs text-muted-foreground">{selected.stock} unidades disponibles</p></div></div>
              <div className="space-y-2"><Label htmlFor="quantity">Cantidad</Label><Input id="quantity" type="number" min={1} max={selected.stock} value={quantity} onChange={(event) => setQuantity(Math.min(selected.stock, Math.max(1, Number(event.target.value) || 1)))} /></div>
              <div className="space-y-2"><Label htmlFor="buyer">Nombre del comprador</Label><Input id="buyer" placeholder="Ej: Martina López" value={buyer} onChange={(event) => setBuyer(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="payment">Método de pago</Label><select id="payment" value={payment} onChange={(event) => setPayment(event.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option>Efectivo</option><option>Tarjeta</option><option>Transferencia</option></select></div>
            </div><SheetFooter className="border-t border-border"><div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Total</span><strong className="text-xl text-primary">{formatPrice(selected.price * quantity)}</strong></div><Button className="w-full" onClick={confirmPurchase} disabled={!buyer.trim()}>Confirmar compra <ChevronRight data-icon="inline-end" /></Button></SheetFooter>
          </>}
          {selected && success && <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center"><div className="mb-5 flex size-16 items-center justify-center rounded-full bg-primary/15 text-primary"><Check className="size-8" /></div><h2 className="font-display text-4xl font-bold uppercase">¡Compra confirmada!</h2><p className="mt-3 text-muted-foreground">{buyer}, reservamos {quantity} {quantity === 1 ? 'unidad' : 'unidades'} de {selected.name}. Podés retirarlo en recepción.</p><Button className="mt-8" onClick={() => setSelected(null)}>Listo</Button></div>}
        </SheetContent>
      </Sheet>
    </main>
  )
}

function ProductCard({ product, onBuy, canBuy }: { product: Product; onBuy: (product: Product) => void; canBuy: boolean }) {
  return <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"><div className="relative aspect-[1.15] overflow-hidden bg-muted"><Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />{product.popular && <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Más vendido</span>}</div><div className="flex min-h-[205px] flex-col p-4"><div><p className="text-xs font-medium uppercase tracking-wider text-primary">{product.category}</p><h3 className="mt-1 text-lg font-semibold">{product.name}</h3><p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">{product.description}</p></div><div className="mt-auto pt-5"><div className="mb-3 flex items-end justify-between gap-2"><div><p className="text-xs text-muted-foreground">Stock: <span className={product.stock <= 5 ? 'font-semibold text-amber-400' : 'text-foreground'}>{product.stock} unidades</span></p><p className="mt-1 text-xl font-bold">{formatPrice(product.price)}</p></div><Button size="sm" onClick={() => onBuy(product)} disabled={!canBuy || product.stock === 0}><ShoppingBag data-icon="inline-start" /> {canBuy ? 'Comprar' : 'Inicia sesión'}</Button></div></div></div></article>
}

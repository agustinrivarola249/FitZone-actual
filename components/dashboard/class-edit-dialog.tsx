'use client'

import * as React from 'react'
import { Pencil } from 'lucide-react'
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
import { toast } from 'sonner'
import { useGymStore } from '@/lib/gym-store'
import type { GymClass } from '@/lib/mock-data'

const activityTypes = ['Musculación', 'Crossfit', 'Pilates', 'Funcional', 'Clases grupales']

export function ClassEditDialog({ gymClass }: { gymClass: GymClass }) {
  const { updateClass } = useGymStore()
  const [open, setOpen] = React.useState(false)
  const [start, setStart] = React.useState(gymClass.start)
  const [end, setEnd] = React.useState(gymClass.end)
  const [capacity, setCapacity] = React.useState(String(gymClass.capacity))
  const [activity, setActivity] = React.useState(gymClass.activity)

  React.useEffect(() => {
    if (open) {
      setStart(gymClass.start)
      setEnd(gymClass.end)
      setCapacity(String(gymClass.capacity))
      setActivity(gymClass.activity)
    }
  }, [open, gymClass])

  const handleSave = () => {
    const cap = Number.parseInt(capacity, 10)
    if (Number.isNaN(cap) || cap <= 0) {
      toast.error('El cupo debe ser un número positivo')
      return
    }
    updateClass(gymClass.id, { start, end, capacity: cap, activity })
    toast.success(`${gymClass.name} actualizada`)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <Pencil data-icon="inline-start" />
            Modificar
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modificar {gymClass.name}</DialogTitle>
          <DialogDescription>
            Ajustá el horario, el cupo y el tipo de actividad.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="start">Inicio</FieldLabel>
              <Input id="start" type="time" value={start} onChange={(e) => setStart(e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="end">Fin</FieldLabel>
              <Input id="end" type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </Field>
          </div>
          <Field>
            <FieldLabel htmlFor="capacity">Cupo</FieldLabel>
            <Input
              id="capacity"
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Tipo de actividad</FieldLabel>
            <Select value={activity} onValueChange={setActivity}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {activityTypes.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Button onClick={handleSave}>Guardar cambios</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Producto } from '@/types'
import { actualizarStock } from '@/data/productoService'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { notifyAvailableOrders } from '@/components/ui/notifications'

const stockSchema = z.object({
  stock: z.coerce.number().min(0, { message: 'El stock no puede ser negativo' }),
})

type StockFormValues = z.infer<typeof stockSchema>

interface ActualizarStockFormProps {
  producto: Producto
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function ActualizarStockForm({
  producto,
  isOpen,
  onClose,
  onSuccess,
}: ActualizarStockFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      stock: producto.stock,
    },
  })

  const onSubmit = async (values: StockFormValues) => {
    setIsSubmitting(true)
    try {
      const result = await actualizarStock(producto.id, values.stock)

      if (result.producto) {
        toast({
          title: 'Stock actualizado',
          description: `El producto "${producto.nombre}" tiene ahora ${values.stock} unidades.`,
        })

        if (result.pedidosSatisfechos.length > 0) {
          toast({
            title: 'Pedidos pendientes disponibles',
            description: `Se pueden satisfacer ${result.pedidosSatisfechos.length} pedidos.`,
          })

          // Si además querés notificación visual personalizada
          setTimeout(() => {
            notifyAvailableOrders(result.pedidosSatisfechos)
          }, 300)
        }

        onSuccess()
        onClose()
      }
    } catch (error) {
      console.error('Error al actualizar el stock:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el stock. Intentalo nuevamente.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Stock: {producto.nombre}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad en Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Cantidad"
                      {...field}
                      onChange={(e) => {
                        field.onChange(Math.max(0, Math.floor(e.target.valueAsNumber || 0)))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Guardando...' : 'Actualizar Stock'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

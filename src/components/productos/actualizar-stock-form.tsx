'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Producto } from '@/types';
import { actualizarStock } from '@/data/productoService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { notifyAvailableOrders, showNotification } from '@/components/ui/notifications';

// Esquema de validación
const stockSchema = z.object({
  stock: z.coerce.number().min(0, { message: 'El stock no puede ser negativo' }),
});

type StockFormValues = z.infer<typeof stockSchema>;

interface ActualizarStockFormProps {
  producto: Producto;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ActualizarStockForm({
  producto,
  isOpen,
  onClose,
  onSuccess,
}: ActualizarStockFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StockFormValues>({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      stock: producto.stock,
    },
  });

  const onSubmit = async (values: StockFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await actualizarStock(producto.id, values.stock);

      if (result.producto) {
        // Notificar al usuario sobre la actualización exitosa
        showNotification(
          'Stock actualizado',
          `Stock del producto "${producto.nombre}" actualizado a ${values.stock} unidades.`,
          'success'
        );

        // Si hay pedidos que ahora pueden satisfacerse, mostrar notificación especial
        if (result.pedidosSatisfechos.length > 0) {
          // Usar setTimeout para que aparezca después de la primera notificación
          setTimeout(() => {
            notifyAvailableOrders(result.pedidosSatisfechos);
          }, 300);
        }

        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al actualizar el stock:', error);
      showNotification(
        'Error',
        'Ocurrió un error al actualizar el stock. Intente nuevamente.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
                        // Permitir solo valores numéricos enteros no negativos
                        field.onChange(Math.max(0, Math.floor(e.target.valueAsNumber || 0)));
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
  );
}

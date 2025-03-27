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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PedidoPendiente } from '@/types';
import { actualizarEstadoPedido, marcarPedidoComoEntregado } from '@/data/pedidoService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';

// Esquema de validación
const estadoSchema = z.object({
  estado: z.enum(['pendiente', 'disponible', 'entregado'], {
    required_error: 'Debes seleccionar un estado',
  }),
});

type EstadoFormValues = z.infer<typeof estadoSchema>;

interface ActualizarEstadoFormProps {
  pedido: PedidoPendiente;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ActualizarEstadoForm({
  pedido,
  isOpen,
  onClose,
  onSuccess,
}: ActualizarEstadoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EstadoFormValues>({
    resolver: zodResolver(estadoSchema),
    defaultValues: {
      estado: pedido.estado,
    },
  });

  const onSubmit = async (values: EstadoFormValues) => {
    setIsSubmitting(true);
    try {
      // Si se marca como entregado, usar la función específica que actualiza stock
      if (values.estado === 'entregado') {
        await marcarPedidoComoEntregado(pedido.id);
      } else {
        await actualizarEstadoPedido(pedido.id, values.estado);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Actualizar Estado del Pedido</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="disponible">Disponible</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch('estado') === 'entregado' && pedido.estado !== 'entregado' && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
                Al marcar como entregado, se actualizará el stock automáticamente si es necesario.
              </div>
            )}

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
                {isSubmitting ? 'Guardando...' : 'Actualizar Estado'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

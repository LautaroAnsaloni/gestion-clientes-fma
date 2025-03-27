'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Input } from '@/components/ui/input';
import { PedidoPendiente, Cliente, Producto } from '@/types';
import { crearPedido, actualizarPedido } from '@/data/pedidoService';
import { obtenerClientes } from '@/data/clienteService';
import { obtenerProductos } from '@/data/productoService';
import { formatCurrency } from '@/lib/utils';

// Esquema de validación
const pedidoSchema = z.object({
  clienteId: z.string().min(1, { message: 'Debes seleccionar un cliente' }),
  productoId: z.string().min(1, { message: 'Debes seleccionar un producto' }),
  cantidad: z.coerce.number().positive({ message: 'La cantidad debe ser mayor que 0' }),
});

type PedidoFormValues = z.infer<typeof pedidoSchema>;

interface PedidoFormProps {
  pedido?: PedidoPendiente;
  onSuccess?: () => void;
}

export function PedidoForm({ pedido, onSuccess }: PedidoFormProps) {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargar clientes y productos
  useEffect(() => {
    setClientes(obtenerClientes());
    setProductos(obtenerProductos());

    // Si hay un pedido, seleccionar el producto
    if (pedido && pedido.productoId) {
      const producto = obtenerProductos().find(p => p.id === pedido.productoId);
      if (producto) {
        setProductoSeleccionado(producto);
      }
    }
  }, [pedido]);

  // Valores por defecto del formulario
  const defaultValues: Partial<PedidoFormValues> = {
    clienteId: pedido?.clienteId || '',
    productoId: pedido?.productoId || '',
    cantidad: pedido?.cantidad || 1,
  };

  const form = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues,
  });

  // Actualizar el producto seleccionado cuando se cambia en el formulario
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'productoId' && value.productoId) {
        const producto = productos.find(p => p.id === value.productoId);
        setProductoSeleccionado(producto || null);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, productos]);

  const onSubmit = async (values: PedidoFormValues) => {
    setIsSubmitting(true);
    try {
      if (pedido) {
        // Actualizar pedido existente
        await actualizarPedido(pedido.id, values);
      } else {
        // Crear nuevo pedido
        await crearPedido(values);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/pedidos');
        router.refresh();
      }
    } catch (error) {
      console.error('Error al guardar el pedido:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="clienteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre} ({cliente.telefono})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productoId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Producto</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {productos.map((producto) => (
                    <SelectItem key={producto.id} value={producto.id}>
                      {producto.nombre} - {formatCurrency(producto.precio)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {productoSeleccionado && (
                <div className="mt-2 text-sm">
                  <div>
                    <span className="font-medium">Precio:</span> {formatCurrency(productoSeleccionado.precio)}
                  </div>
                  <div>
                    <span className="font-medium">Stock:</span> {productoSeleccionado.stock}
                  </div>
                  {productoSeleccionado.stock === 0 && (
                    <div className="mt-1 text-destructive">
                      Este producto no tiene stock. El pedido quedará en estado pendiente.
                    </div>
                  )}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cantidad"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cantidad</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="1"
                  min="1"
                  {...field}
                  onChange={(e) => {
                    // Permitir solo valores numéricos enteros positivos
                    field.onChange(Math.max(1, Math.floor(e.target.valueAsNumber || 1)));
                  }}
                />
              </FormControl>
              {productoSeleccionado && field.value > productoSeleccionado.stock && (
                <div className="text-sm text-amber-600">
                  La cantidad solicitada supera el stock. El pedido quedará en estado pendiente.
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {productoSeleccionado && form.watch('cantidad') && (
          <div className="rounded-md border border-muted p-4">
            <h3 className="font-medium">Resumen del pedido</h3>
            <div className="mt-2 space-y-1 text-sm">
              <div><span className="font-medium">Producto:</span> {productoSeleccionado.nombre}</div>
              <div><span className="font-medium">Cantidad:</span> {form.watch('cantidad')}</div>
              <div><span className="font-medium">Precio unitario:</span> {formatCurrency(productoSeleccionado.precio)}</div>
              <div className="text-lg font-bold">
                <span className="font-medium">Total:</span> {formatCurrency(productoSeleccionado.precio * form.watch('cantidad'))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : pedido ? 'Actualizar' : 'Crear Pedido'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

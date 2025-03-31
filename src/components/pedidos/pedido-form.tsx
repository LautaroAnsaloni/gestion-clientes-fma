'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Cliente, Producto, PedidoPendiente } from '@/types';
import { obtenerClientes } from '@/data/clienteService';
import { obtenerProductos } from '@/data/productoService';
import { crearPedido } from '@/data/pedidoService';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

const pedidoSchema = z.object({
  clienteId: z.string().min(1, 'Selecciona un cliente'),
  productos: z
    .array(
      z.object({
        productoId: z.string().min(1, 'Selecciona un producto'),
        cantidad: z.coerce.number().positive('Cantidad inválida'),
      })
    )
    .min(1, 'Agrega al menos un producto'),
});

type PedidoFormValues = z.infer<typeof pedidoSchema>;

interface PedidoFormProps {
  onSuccess?: () => void;
}

export function PedidoForm({ onSuccess }: PedidoFormProps) {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const form = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      clienteId: '',
      productos: [{ productoId: '', cantidad: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'productos',
  });

  useEffect(() => {
    const fetch = async () => {
      const c = await obtenerClientes();
      const p = await obtenerProductos();
      setClientes(c);
      setProductos(p);
    };
    fetch();
  }, []);

  const onSubmit = async (values: PedidoFormValues) => {
    try {
      await crearPedido(values);
      onSuccess?.();
      router.push('/pedidos');
      router.refresh();
    } catch (error) {
      console.error('Error al crear pedido:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Cliente */}
        <FormField
          control={form.control}
          name="clienteId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        {/* Productos dinámicos */}
        {fields.map((field, index) => (
          <div
          key={field.id}
          className="space-y-4 rounded-md border border-muted p-4 relative"
        >
          {/* Botón Quitar arriba a la derecha */}
          {fields.length > 1 && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 z-10"
              onClick={() => remove(index)}
            >
              Quitar
            </Button>
          )}
        
          {/* Agregá padding-top extra para que el botón no tape el Select */}
          <div className="pt-6 space-y-4">
            <FormField
              control={form.control}
              name={`productos.${index}.productoId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Producto</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <FormMessage />
                </FormItem>
              )}
            />
        
            <FormField
              control={form.control}
              name={`productos.${index}.cantidad`}
              render={({ field }) => {
                const selectedProduct = productos.find(
                  (p) => p.id === form.watch(`productos.${index}.productoId`)
                );
                const cantidad = form.watch(`productos.${index}.cantidad`);
                return (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        min="1"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            Math.max(1, Math.floor(e.target.valueAsNumber || 1))
                          )
                        }
                      />
                    </FormControl>
                    {selectedProduct && (
                      <div className="text-sm mt-1">
                        Stock: {selectedProduct.stock}
                        {cantidad > selectedProduct.stock && (
                          <span className="ml-2 text-destructive">
                            (excede stock, quedará pendiente)
                          </span>
                        )}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>
        ))}

        {/* Botón agregar producto */}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ productoId: '', cantidad: 1 })}
        >
          + Agregar producto
        </Button>

        {/* Total */}
        <div className="border-t pt-4 text-sm font-medium text-right">
          Total:{" "}
          {formatCurrency(
            form.watch('productos').reduce((acc, p) => {
              const producto = productos.find((prod) => prod.id === p.productoId);
              return acc + (producto ? producto.precio * p.cantidad : 0);
            }, 0)
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit">Crear Pedido</Button>
        </div>
      </form>
    </Form>
  );
}


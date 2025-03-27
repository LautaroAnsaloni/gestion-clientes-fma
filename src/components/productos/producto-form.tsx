'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Producto } from '@/types';
import { crearProducto, actualizarProducto } from '@/data/productoService';

// Esquema de validación
const productoSchema = z.object({
  nombre: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  descripcion: z.string().min(5, { message: 'La descripción debe tener al menos 5 caracteres' }),
  precio: z.coerce.number().positive({ message: 'El precio debe ser mayor que 0' }),
  stock: z.coerce.number().min(0, { message: 'El stock no puede ser negativo' }),
});

type ProductoFormValues = z.infer<typeof productoSchema>;

interface ProductoFormProps {
  producto?: Producto;
  onSuccess?: () => void;
}

export function ProductoForm({ producto, onSuccess }: ProductoFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Valores por defecto del formulario
  const defaultValues: Partial<ProductoFormValues> = {
    nombre: producto?.nombre || '',
    descripcion: producto?.descripcion || '',
    precio: producto?.precio || 0,
    stock: producto?.stock || 0,
  };

  const form = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues,
  });

  const onSubmit = async (values: ProductoFormValues) => {
    setIsSubmitting(true);
    try {
      if (producto) {
        // Actualizar producto existente
        await actualizarProducto(producto.id, values);
      } else {
        // Crear nuevo producto
        await crearProducto(values);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/productos');
        router.refresh();
      }
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del producto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder="Descripción del producto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="precio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Precio</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => {
                    // Permitir solo valores numéricos
                    field.onChange(e.target.valueAsNumber || 0);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  onChange={(e) => {
                    // Permitir solo valores numéricos enteros
                    field.onChange(Math.max(0, Math.floor(e.target.valueAsNumber || 0)));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : producto ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

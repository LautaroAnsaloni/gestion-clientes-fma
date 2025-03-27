'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductoForm } from '@/components/productos/producto-form';
import { obtenerProductoPorId } from '@/data/productoService';
import { Producto } from '@/types';

interface EditarProductoPageProps {
  params: {
    id: string;
  };
}

export default function EditarProductoPage({ params }: EditarProductoPageProps) {
  const { id } = params;
  const router = useRouter();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducto = () => {
      try {
        const productoEncontrado = obtenerProductoPorId(id);
        if (productoEncontrado) {
          setProducto(productoEncontrado);
        } else {
          setError('No se encontró el producto');
          setTimeout(() => {
            router.push('/productos');
          }, 2000);
        }
      } catch (err) {
        setError('Error al cargar el producto');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducto();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Editar Producto</h1>
      <div className="mx-auto max-w-2xl">
        {producto && <ProductoForm producto={producto} />}
      </div>
    </div>
  );
}

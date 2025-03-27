'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PedidoForm } from '@/components/pedidos/pedido-form';
import { obtenerPedidoPorId } from '@/data/pedidoService';
import { PedidoPendiente } from '@/types';

interface EditarPedidoPageProps {
  params: {
    id: string;
  };
}

export default function EditarPedidoPage({ params }: EditarPedidoPageProps) {
  const { id } = params;
  const router = useRouter();
  const [pedido, setPedido] = useState<PedidoPendiente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedido = () => {
      try {
        const pedidoEncontrado = obtenerPedidoPorId(id);
        if (pedidoEncontrado) {
          setPedido(pedidoEncontrado);
        } else {
          setError('No se encontró el pedido');
          setTimeout(() => {
            router.push('/pedidos');
          }, 2000);
        }
      } catch (err) {
        setError('Error al cargar el pedido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPedido();
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
      <h1 className="text-2xl font-bold">Editar Pedido</h1>
      <div className="mx-auto max-w-2xl">
        {pedido && <PedidoForm pedido={pedido} />}
      </div>
    </div>
  );
}

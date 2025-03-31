'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClienteForm } from '@/components/clientes/cliente-form';
import { obtenerClientePorId } from '@/data/clienteService';
import { Cliente } from '@/types';

interface EditarClientePageProps {
  params: {
    id: string;
  };
}

export default function EditarClientePage({ params }: EditarClientePageProps) {
  const { id } = params;
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const clienteEncontrado = await obtenerClientePorId(id)
        if (clienteEncontrado) {
          setCliente(clienteEncontrado)
        } else {
          setError('No se encontró el cliente')
          setTimeout(() => {
            router.push('/clientes')
          }, 2000)
        }
      } catch (err) {
        setError('Error al cargar el cliente')
      } finally {
        setIsLoading(false)
      }
    }
  
    fetchCliente()
  }, [id, router])

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
      <h1 className="text-2xl font-bold">Editar Cliente</h1>
      <div className="mx-auto max-w-2xl">
        {cliente && <ClienteForm cliente={cliente} />}
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { obtenerClientes, eliminarCliente } from '@/data/clienteService';
import { Cliente } from '@/types';
import { Edit, Trash, Plus } from 'lucide-react';

export default function ClientesPage() {
  const router = useRouter();
  const [clientes, setClientes] = useState<Cliente[]>(obtenerClientes());
  const [clienteAEliminar, setClienteAEliminar] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!clienteAEliminar) return;

    setIsDeleting(true);
    try {
      const resultado = eliminarCliente(clienteAEliminar);
      if (resultado) {
        setClientes(obtenerClientes());
      }
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
    } finally {
      setIsDeleting(false);
      setClienteAEliminar(null);
    }
  };

  const columns = [
    {
      header: 'Nombre',
      accessorKey: 'nombre',
    },
    {
      header: 'Teléfono',
      accessorKey: 'telefono',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Fecha de Registro',
      accessorKey: 'fechaRegistro',
      cell: (cliente: Cliente) => (
        <span>{new Date(cliente.fechaRegistro).toLocaleDateString('es-AR')}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={() => router.push('/clientes/nuevo')}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
        </Button>
      </div>

      <DataTable
        data={clientes}
        columns={columns}
        searchPlaceholder="Buscar clientes..."
        actions={(cliente) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/clientes/${cliente.id}/editar`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setClienteAEliminar(cliente.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        isOpen={!!clienteAEliminar}
        onClose={() => setClienteAEliminar(null)}
        onConfirm={handleDelete}
        title="Eliminar Cliente"
        description="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
}

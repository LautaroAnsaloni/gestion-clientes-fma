'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ActualizarEstadoForm } from '@/components/pedidos/actualizar-estado-form';
import { VerificarDisponibilidad } from '@/components/pedidos/verificar-disponibilidad';
import { obtenerPedidosConDetalles, eliminarPedido } from '@/data/pedidoService';
import { PedidoPendiente } from '@/types';
import { formatCurrency, getEstadoClass, getEstadoLabel } from '@/lib/utils';
import { Edit, Trash, Plus, Tag } from 'lucide-react';

export default function PedidosPage() {
  const router = useRouter();

  const [pedidos, setPedidos] = useState<PedidoPendiente[]>([]);
  const [pedidoAEliminar, setPedidoAEliminar] = useState<string | null>(null);
  const [pedidoAActualizar, setPedidoAActualizar] = useState<PedidoPendiente | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 🔁 Obtener pedidos desde Firestore
  useEffect(() => {
    const fetchPedidos = async () => {
      const data = await obtenerPedidosConDetalles();
      setPedidos(data);
    };
    fetchPedidos();
  }, []);

  const handleDelete = async () => {
    if (!pedidoAEliminar) return;

    setIsDeleting(true);
    try {
      await eliminarPedido(pedidoAEliminar);
      const actualizados = await obtenerPedidosConDetalles();
      setPedidos(actualizados);
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    } finally {
      setIsDeleting(false);
      setPedidoAEliminar(null);
    }
  };

  const handleEstadoUpdated = async () => {
    const data = await obtenerPedidosConDetalles();
    setPedidos(data);
  };

  const columns = [
    {
      header: 'Cliente',
      accessorKey: 'cliente',
      cell: (pedido: PedidoPendiente) => (
        <span>{pedido.cliente?.nombre || 'Cliente desconocido'}</span>
      ),
    },
    {
      header: 'Productos',
      accessorKey: 'productos',
      cell: (pedido: PedidoPendiente) => (
        <ul className="text-sm space-y-1">
          {pedido.productos.map((pp) => (
            <li key={pp.productoId}>
              {pp.producto?.nombre || 'Producto'} x {pp.cantidad}
            </li>
          ))}
        </ul>
      ),
    },
    {
      header: 'Total',
      accessorKey: 'total',
      cell: (pedido: PedidoPendiente) => {
        const total = pedido.productos.reduce((acc, pp) => {
          return acc + (pp.producto ? pp.producto.precio * pp.cantidad : 0);
        }, 0);
        return <span>{formatCurrency(total)}</span>;
      },
    },
    {
      header: 'Fecha',
      accessorKey: 'fechaSolicitud',
      cell: (pedido: PedidoPendiente) => (
        <span>{new Date(pedido.fechaSolicitud).toLocaleDateString('es-AR')}</span>
      ),
    },
    {
      header: 'Estado',
      accessorKey: 'estado',
      cell: (pedido: PedidoPendiente) => (
        <div className="flex items-center">
          <span
            className={`mr-2 rounded-full px-2 py-1 text-xs font-semibold ${getEstadoClass(pedido.estado)}`}
          >
            {getEstadoLabel(pedido.estado)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPedidoAActualizar(pedido)}
          >
            <Tag className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <div className="flex space-x-2">
          <VerificarDisponibilidad onSuccess={handleEstadoUpdated} />
          <Button onClick={() => router.push('/pedidos/nuevo')}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
          </Button>
        </div>
      </div>

      <DataTable
        data={pedidos}
        columns={columns}
        searchPlaceholder="Buscar pedidos..."
        actions={(pedido) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/pedidos/${pedido.id}/editar`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPedidoAEliminar(pedido.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        isOpen={!!pedidoAEliminar}
        onClose={() => setPedidoAEliminar(null)}
        onConfirm={handleDelete}
        title="Eliminar Pedido"
        description="¿Estás seguro de que deseas eliminar este pedido? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isLoading={isDeleting}
      />

      {pedidoAActualizar && (
        <ActualizarEstadoForm
          pedido={pedidoAActualizar}
          isOpen={!!pedidoAActualizar}
          onClose={() => setPedidoAActualizar(null)}
          onSuccess={handleEstadoUpdated}
        />
      )}
    </div>
  );
}

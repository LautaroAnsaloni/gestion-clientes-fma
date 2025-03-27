'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { StockUpdateButton } from '@/components/productos/stock-update-button';
import { obtenerProductos, eliminarProducto } from '@/data/productoService';
import { Producto } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Edit, Trash, Plus } from 'lucide-react';

export default function ProductosPage() {
  const router = useRouter();
  const [productos, setProductos] = useState<Producto[]>(obtenerProductos());
  const [productoAEliminar, setProductoAEliminar] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!productoAEliminar) return;

    setIsDeleting(true);
    try {
      const resultado = eliminarProducto(productoAEliminar);
      if (resultado) {
        setProductos(obtenerProductos());
      }
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    } finally {
      setIsDeleting(false);
      setProductoAEliminar(null);
    }
  };

  const handleStockUpdated = () => {
    // Actualizar la lista de productos
    setProductos(obtenerProductos());
  };

  const columns = [
    {
      header: 'Nombre',
      accessorKey: 'nombre',
    },
    {
      header: 'Descripción',
      accessorKey: 'descripcion',
    },
    {
      header: 'Precio',
      accessorKey: 'precio',
      cell: (producto: Producto) => (
        <span>{formatCurrency(producto.precio)}</span>
      ),
    },
    {
      header: 'Stock',
      accessorKey: 'stock',
      cell: (producto: Producto) => (
        <div className="flex items-center">
          <span className={`mr-2 ${producto.stock === 0 ? 'text-destructive' : 'text-primary'}`}>
            {producto.stock}
          </span>
          <StockUpdateButton
            producto={producto}
            onStockUpdated={handleStockUpdated}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Button onClick={() => router.push('/productos/nuevo')}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
        </Button>
      </div>

      <DataTable
        data={productos}
        columns={columns}
        searchPlaceholder="Buscar productos..."
        actions={(producto) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/productos/${producto.id}/editar`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setProductoAEliminar(producto.id)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      <ConfirmDialog
        isOpen={!!productoAEliminar}
        onClose={() => setProductoAEliminar(null)}
        onConfirm={handleDelete}
        title="Eliminar Producto"
        description="¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        isLoading={isDeleting}
      />
    </div>
  );
}

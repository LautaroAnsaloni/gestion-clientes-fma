'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { ConfirmDialog } from '@/components/ui/confirm-dialog'
import { StockUpdateButton } from '@/components/productos/stock-update-button'
import { obtenerProductos, eliminarProducto } from '@/data/productoService'
import { Producto } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Edit, Trash, Plus } from 'lucide-react'

export default function ProductosPage() {
  const router = useRouter()
  const [productos, setProductos] = useState<Producto[]>([])
  const [productoAEliminar, setProductoAEliminar] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // 🔁 Cargar productos desde Firestore al iniciar
  useEffect(() => {
    const fetchProductos = async () => {
      const lista = await obtenerProductos()
      setProductos(lista)
    }
    fetchProductos()
  }, [])

  // 🗑️ Eliminar producto y actualizar lista
  const handleDelete = async () => {
    if (!productoAEliminar) return

    setIsDeleting(true)
    try {
      await eliminarProducto(productoAEliminar)
      const listaActualizada = await obtenerProductos()
      setProductos(listaActualizada)
    } catch (error) {
      console.error('Error al eliminar el producto:', error)
    } finally {
      setIsDeleting(false)
      setProductoAEliminar(null)
    }
  }

  // 🔄 Actualizar stock y refrescar lista
  const handleStockUpdated = async () => {
    const lista = await obtenerProductos()
    setProductos(lista)
  }

  // 📊 Columnas de la tabla
  const columns = [
    {
      header: 'Nombre',
      accessorKey: 'nombre' as const,
    },
    {
      header: 'Descripción',
      accessorKey: 'descripcion' as const,
    },
    {
      header: 'Precio',
      accessorKey: 'precio' as const,
      cell: (producto: Producto) => (
        <span>{formatCurrency(producto.precio)}</span>
      ),
    },
    {
      header: 'Stock',
      accessorKey: 'stock' as const,
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
  ]

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
  )
}


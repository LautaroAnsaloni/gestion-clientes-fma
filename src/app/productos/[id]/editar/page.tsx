'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { obtenerProductoPorId, actualizarProducto } from '@/data/productoService'
import { Producto } from '@/types'
import { ProductoForm } from '@/components/productos/producto-form'
import { useToast } from '@/hooks/use-toast'

interface EditarProductoPageProps {
  params: { id: string }
}

export default function EditarProductoPage({ params }: EditarProductoPageProps) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()

  const [producto, setProducto] = useState<Producto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducto = async () => {
      const data = await obtenerProductoPorId(id)
      setProducto(data)
      setLoading(false)
    }
    fetchProducto()
  }, [id])

  const handleSubmit = async (data: Partial<Producto>) => {
    try {
      await actualizarProducto(id, data)
      toast({
        title: 'Producto actualizado',
        description: 'Los cambios fueron guardados correctamente.',
      })
      router.push('/productos')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al actualizar el producto.',
      })
    }
  }

  if (loading) return <p className="text-center py-8">Cargando...</p>

  if (!producto) return <p className="text-center py-8 text-destructive">Producto no encontrado.</p>

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Editar Producto</h1>
      <ProductoForm producto={producto} onSubmit={handleSubmit} />
    </div>
  )
}

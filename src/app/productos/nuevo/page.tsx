'use client'

import { useRouter } from 'next/navigation'
import { ProductoForm } from '@/components/productos/producto-form'
import { crearProducto } from '@/data/productoService'
import { useToast } from '@/hooks/use-toast'

export default function NuevoProductoPage() {
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (data: Omit<any, 'id' | 'creadoEn'>) => {
    try {
      await crearProducto(data)
      toast({
        title: 'Producto creado',
        description: 'El producto fue agregado correctamente.',
      })
      router.push('/productos')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error al crear el producto.',
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Nuevo Producto</h1>
      <ProductoForm onSubmit={handleSubmit} />
    </div>
  )
}

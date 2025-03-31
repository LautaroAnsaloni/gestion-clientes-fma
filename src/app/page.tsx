'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { obtenerClientes } from '@/data/clienteService'
import { obtenerProductos } from '@/data/productoService'
import { obtenerPedidos, obtenerPedidosConDetalles } from '@/data/pedidoService'
import { Cliente, Producto, PedidoPendiente } from '@/types'
import { DashboardCard } from '@/components/ui/dashboard-card'
import { QuickAction } from '@/components/ui/quick-action'
import { RecentClients } from '@/components/dashboard/recent-clients'
import { PendingOrders } from '@/components/dashboard/pending-orders'
import { StockStatus } from '@/components/dashboard/stock-status'
import { VerificarDisponibilidad } from '@/components/pedidos/verificar-disponibilidad'
import {
  Users,
  Package,
  ShoppingCart,
  AlertTriangle,
  UserPlus,
  PackagePlus,
  ClipboardList,
} from 'lucide-react'

export default function Home() {
  const router = useRouter()

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [pedidos, setPedidos] = useState<PedidoPendiente[]>([])

  // 🔁 Obtener datos de Firestore
  useEffect(() => {
    const fetchData = async () => {
      const clientesDB = await obtenerClientes()
      const productosDB = await obtenerProductos()
      const pedidosDB = await obtenerPedidosConDetalles()

      setClientes(clientesDB)
      setProductos(productosDB)
      setPedidos(pedidosDB)
    }
    fetchData()
  }, [])

  const actualizarDatos = useCallback(async () => {
    const productosDB = await obtenerProductos()
    const pedidosDB = await obtenerPedidosConDetalles()

    setProductos(productosDB)
    setPedidos(pedidosDB)
  }, [])

  const totalClientes = clientes.length
  const totalProductos = productos.length
  const productosEnStock = productos.filter(p => p.stock > 0).length

  // 🔄 Filtrar pedidos por estado localmente
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente')
  const pedidosDisponibles = pedidos.filter(p => p.estado === 'disponible')

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <VerificarDisponibilidad onSuccess={actualizarDatos} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Clientes"
          value={totalClientes}
          description="Clientes registrados"
          icon={Users}
        />
        <DashboardCard
          title="Total Productos"
          value={totalProductos}
          description="Productos en catálogo"
          icon={Package}
        />
        <DashboardCard
          title="Productos en Stock"
          value={productosEnStock}
          description={`${Math.round((productosEnStock / totalProductos) * 100)}% del catálogo`}
          icon={ShoppingCart}
        />
        <DashboardCard
          title="Pendientes"
          value={pedidosPendientes.length}
          description={`${pedidosDisponibles.length} pedidos listos para entregar`}
          icon={AlertTriangle}
        />
      </div>

      <h2 className="mb-4 mt-10 text-2xl font-bold">Acciones Rápidas</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <QuickAction
          title="Nuevo Cliente"
          description="Registrar un nuevo cliente en el sistema"
          icon={UserPlus}
          onClick={() => router.push('/clientes/nuevo')}
        />
        <QuickAction
          title="Nuevo Producto"
          description="Añadir un nuevo producto al catálogo"
          icon={PackagePlus}
          onClick={() => router.push('/productos/nuevo')}
        />
        <QuickAction
          title="Crear Pedido"
          description="Registrar un pedido pendiente para un cliente"
          icon={ClipboardList}
          onClick={() => router.push('/pedidos/nuevo')}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <RecentClients clients={clientes} />
        </div>
        <div className="lg:col-span-4">
          <StockStatus productos={productos} onStockUpdated={actualizarDatos} />
        </div>
        <div className="lg:col-span-4">
          <PendingOrders orders={pedidos} />
        </div>
      </div>
    </div>
  )
}

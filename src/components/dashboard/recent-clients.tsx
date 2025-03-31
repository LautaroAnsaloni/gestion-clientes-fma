'use client'

import { useRouter } from 'next/navigation'
import { Cliente } from '@/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface RecentClientsProps {
  clients: Cliente[]
}

export function RecentClients({ clients }: RecentClientsProps) {
  const router = useRouter()

  // Ordenar por fecha de registro descendente y tomar los 5 más recientes
  const clientesRecientes = [...clients]
    .sort((a, b) =>
      new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
    )
    .slice(0, 5)

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">Clientes Recientes</h3>
        <Button
          variant="link"
          className="text-sm p-0 h-auto"
          onClick={() => router.push('/clientes')}
        >
          Ver todos
        </Button>
      </div>
      <ul className="space-y-2">
        {clientesRecientes.length > 0 ? (
          clientesRecientes.map((cliente) => (
            <li key={cliente.id} className="text-sm border-b pb-2 last:border-b-0">
              <div className="font-medium">{cliente.nombre}</div>
              <div className="text-muted-foreground">{cliente.email}</div>
            </li>
          ))
        ) : (
          <li className="text-sm text-muted-foreground">No hay clientes registrados aún.</li>
        )}
      </ul>
    </Card>
  )
}

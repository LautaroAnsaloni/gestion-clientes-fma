import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatCurrency, getEstadoClass, getEstadoLabel } from '@/lib/utils';

interface PendingOrdersProps {
  orders: {
    id: string;
    cliente?: {
      id: string;
      nombre: string;
    };
    producto?: {
      id: string;
      nombre: string;
      precio: number;
    };
    cantidad: number;
    estado: 'pendiente' | 'disponible' | 'entregado';
  }[];
}

export function PendingOrders({ orders }: PendingOrdersProps) {
  // Filtrar solo pedidos pendientes o disponibles (no mostrar entregados)
  const filteredOrders = orders.filter(order =>
    order.estado === 'pendiente' || order.estado === 'disponible'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos Pendientes</CardTitle>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No hay pedidos pendientes
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.cliente?.nombre || 'Cliente desconocido'}</TableCell>
                  <TableCell>{order.producto?.nombre || 'Producto desconocido'}</TableCell>
                  <TableCell>{order.cantidad}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoClass(order.estado)}`}>
                      {getEstadoLabel(order.estado)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

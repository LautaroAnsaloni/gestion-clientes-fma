'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { PedidoPendiente } from '@/types';
import { getEstadoLabel } from '@/lib/utils';

interface PedidosChartProps {
  pedidos: PedidoPendiente[];
}

export function PedidosChart({ pedidos }: PedidosChartProps) {
  // Contar pedidos por estado
  const contadorPedidos = {
    pendiente: pedidos.filter(p => p.estado === 'pendiente').length,
    disponible: pedidos.filter(p => p.estado === 'disponible').length,
    entregado: pedidos.filter(p => p.estado === 'entregado').length,
  };

  const data = [
    {
      name: 'Pendiente',
      cantidad: contadorPedidos.pendiente,
      color: '#eab308'
    },
    {
      name: 'Disponible',
      cantidad: contadorPedidos.disponible,
      color: '#10b981'
    },
    {
      name: 'Entregado',
      cantidad: contadorPedidos.entregado,
      color: '#3b82f6'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Pedidos</CardTitle>
        <CardDescription>Distribución de pedidos por estado</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => [`${value} pedidos`, 'Cantidad']}
              />
              <Legend />
              <Bar dataKey="cantidad" name="Cantidad" fill="#8884d8">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

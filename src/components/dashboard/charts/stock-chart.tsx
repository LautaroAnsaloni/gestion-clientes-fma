'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Producto } from '@/types';

interface StockChartProps {
  productos: Producto[];
}

export function StockChart({ productos }: StockChartProps) {
  // Calcular productos con y sin stock
  const productosConStock = productos.filter(p => p.stock > 0).length;
  const productosSinStock = productos.filter(p => p.stock === 0).length;

  const data = [
    { name: 'Con Stock', value: productosConStock, color: '#10b981' },
    { name: 'Sin Stock', value: productosSinStock, color: '#ef4444' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos en Stock</CardTitle>
        <CardDescription>Distribución de productos con y sin stock</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} productos`, 'Cantidad']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

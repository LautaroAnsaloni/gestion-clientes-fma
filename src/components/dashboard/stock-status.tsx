'use client';

import { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockUpdateButton } from '@/components/productos/stock-update-button';
import { Producto } from '@/types';
import { obtenerProductos } from '@/data/productoService';

interface StockStatusProps {
  productos: Producto[];
  onStockUpdated?: () => void;
}

export function StockStatus({ productos, onStockUpdated }: StockStatusProps) {
  // Calcular estadísticas de productos
  const productosConStock = productos.filter(p => p.stock > 0);
  const productosSinStock = productos.filter(p => p.stock === 0);

  // Clasificar productos con stock bajo (menos de 5 unidades)
  const productosStockBajo = productosConStock.filter(p => p.stock < 5);

  // Manejador para cuando se actualiza el stock
  const handleStockUpdated = useCallback(() => {
    if (onStockUpdated) {
      onStockUpdated();
    }
  }, [onStockUpdated]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado del Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center rounded-md border p-4">
              <span className="text-2xl font-bold text-green-600">
                {productosConStock.length}
              </span>
              <span className="text-xs text-muted-foreground">Con Stock</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md border p-4">
              <span className="text-2xl font-bold text-amber-500">
                {productosStockBajo.length}
              </span>
              <span className="text-xs text-muted-foreground">Stock Bajo</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-md border p-4">
              <span className="text-2xl font-bold text-red-600">
                {productosSinStock.length}
              </span>
              <span className="text-xs text-muted-foreground">Sin Stock</span>
            </div>
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium">Productos sin stock:</h3>
            <div className="max-h-48 overflow-auto rounded-md border">
              {productosSinStock.length === 0 ? (
                <div className="p-3 text-center text-sm text-muted-foreground">
                  No hay productos sin stock
                </div>
              ) : (
                <ul className="divide-y">
                  {productosSinStock.map(producto => (
                    <li key={producto.id} className="flex items-center justify-between p-3">
                      <div>
                        <div className="text-sm font-medium">{producto.nombre}</div>
                        <div className="text-xs text-muted-foreground">
                          {producto.descripcion.length > 30
                            ? `${producto.descripcion.substring(0, 30)}...`
                            : producto.descripcion}
                        </div>
                      </div>
                      <StockUpdateButton
                        producto={producto}
                        onStockUpdated={handleStockUpdated}
                        buttonText="Actualizar"
                        size="sm"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

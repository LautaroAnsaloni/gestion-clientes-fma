'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ActualizarStockForm } from '@/components/productos/actualizar-stock-form';
import { Producto } from '@/types';
import { Package } from 'lucide-react';

interface StockUpdateButtonProps {
  producto: Producto;
  onStockUpdated: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showIcon?: boolean;
  buttonText?: string;
}

export function StockUpdateButton({
  producto,
  onStockUpdated,
  variant = 'outline',
  size = 'sm',
  showIcon = true,
  buttonText = 'Actualizar Stock'
}: StockUpdateButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsDialogOpen(true)}
      >
        {showIcon && <Package className="mr-2 h-4 w-4" />}
        {buttonText}
      </Button>

      {isDialogOpen && (
        <ActualizarStockForm
          producto={producto}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={onStockUpdated}
        />
      )}
    </>
  );
}

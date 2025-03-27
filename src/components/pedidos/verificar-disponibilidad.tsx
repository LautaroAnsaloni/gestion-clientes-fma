'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { verificarDisponibilidadPedidos } from '@/data/pedidoService';
import { RefreshCw } from 'lucide-react';
import { notifyAvailableOrders } from '@/components/ui/notifications';

interface VerificarDisponibilidadProps {
  onSuccess: () => void;
}

export function VerificarDisponibilidad({ onSuccess }: VerificarDisponibilidadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleVerificar = async () => {
    setIsLoading(true);
    try {
      const pedidosActualizados = verificarDisponibilidadPedidos();

      // Mostrar notificaciones con la información
      notifyAvailableOrders(pedidosActualizados);

      // Actualizar la interfaz
      onSuccess();
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleVerificar} disabled={isLoading} variant="outline">
      <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      Verificar Disponibilidad
    </Button>
  );
}

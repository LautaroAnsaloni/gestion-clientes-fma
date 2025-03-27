'use client';

import { Toaster, toast } from 'sonner';
import { PedidoPendiente } from '@/types';
import { getEstadoLabel } from '@/lib/utils';

// Componente principal que debe añadirse en layout.tsx
export function Notifications() {
  return <Toaster position="bottom-right" />;
}

// Función para mostrar una notificación simple
export function showNotification(title: string, message: string, type: 'success' | 'error' | 'info' = 'info') {
  switch (type) {
    case 'success':
      toast.success(title, {
        description: message,
        duration: 5000,
      });
      break;
    case 'error':
      toast.error(title, {
        description: message,
        duration: 5000,
      });
      break;
    default:
      toast(title, {
        description: message,
        duration: 4000,
      });
      break;
  }
}

// Función para notificar pedidos que ahora están disponibles
export function notifyAvailableOrders(pedidosActualizados: PedidoPendiente[]) {
  if (pedidosActualizados.length === 0) {
    toast.info('Verificación completada', {
      description: 'No se encontraron pedidos para actualizar.',
    });
    return;
  }

  // Mostrar toast principal
  toast.success(`Pedidos disponibles: ${pedidosActualizados.length}`, {
    description: 'Se han encontrado pedidos que ahora pueden satisfacerse.',
    duration: 5000,
    action: {
      label: 'Ver todos',
      onClick: () => window.location.href = '/pedidos',
    },
  });

  // Mostrar notificaciones individuales para cada pedido (máximo 3)
  const maxToShow = Math.min(3, pedidosActualizados.length);

  for (let i = 0; i < maxToShow; i++) {
    const pedido = pedidosActualizados[i];

    setTimeout(() => {
      toast(`Pedido #${pedido.id} disponible`, {
        description: `Cliente: ${pedido.cliente?.nombre || 'Cliente'} - Producto: ${pedido.producto?.nombre || 'Producto'}`,
        duration: 4000,
      });
    }, i * 300); // Mostrar cada notificación con un pequeño retraso
  }

  // Si hay más de 3, mostrar una notificación adicional
  if (pedidosActualizados.length > 3) {
    setTimeout(() => {
      toast.info(`Y ${pedidosActualizados.length - 3} pedidos más`, {
        description: 'Visita la página de pedidos para ver todos los detalles.',
        duration: 3000,
      });
    }, maxToShow * 300);
  }
}

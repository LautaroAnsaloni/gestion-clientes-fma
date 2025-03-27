import { PedidoPendiente } from '@/types';
import { pedidosPendientes as pedidosIniciales } from './mockData';
import { obtenerClientePorId } from './clienteService';
import { obtenerProductoPorId, actualizarStock } from './productoService';

// Usamos un array mutable para simular una base de datos
let pedidos = [...pedidosIniciales];

/**
 * Obtiene todos los pedidos pendientes
 */
export const obtenerPedidos = (): PedidoPendiente[] => {
  return [...pedidos];
};

/**
 * Obtiene un pedido por su ID
 */
export const obtenerPedidoPorId = (id: string): PedidoPendiente | undefined => {
  return pedidos.find(p => p.id === id);
};

/**
 * Obtiene pedidos con detalles completos de cliente y producto
 */
export const obtenerPedidosConDetalles = (): PedidoPendiente[] => {
  return pedidos.map(pedido => {
    const cliente = obtenerClientePorId(pedido.clienteId);
    const producto = obtenerProductoPorId(pedido.productoId);

    return {
      ...pedido,
      cliente,
      producto
    };
  });
};

/**
 * Obtiene pedidos filtrados por estado
 */
export const obtenerPedidosPorEstado = (estado: PedidoPendiente['estado']): PedidoPendiente[] => {
  return obtenerPedidosConDetalles().filter(p => p.estado === estado);
};

/**
 * Obtiene pedidos pendientes para un producto específico
 */
export const obtenerPedidosPendientesPorProducto = (productoId: string): PedidoPendiente[] => {
  return obtenerPedidosConDetalles().filter(p =>
    p.estado === 'pendiente' && p.productoId === productoId
  );
};

/**
 * Crea un nuevo pedido pendiente
 */
export const crearPedido = (pedido: Omit<PedidoPendiente, 'id' | 'fechaSolicitud' | 'estado'>): PedidoPendiente => {
  // Verificar disponibilidad del producto
  const producto = obtenerProductoPorId(pedido.productoId);
  const estado = producto && producto.stock >= pedido.cantidad ? 'disponible' : 'pendiente';

  const nuevoPedido: PedidoPendiente = {
    ...pedido,
    id: (pedidos.length + 1).toString(),
    fechaSolicitud: new Date().toISOString().split('T')[0],
    estado,
  };

  pedidos.push(nuevoPedido);

  // Si el producto está disponible, reducir el stock
  if (estado === 'disponible' && producto) {
    actualizarStock(producto.id, producto.stock - pedido.cantidad);
  }

  return nuevoPedido;
};

/**
 * Actualiza un pedido existente
 */
export const actualizarPedido = (id: string, datosActualizados: Partial<Omit<PedidoPendiente, 'id' | 'fechaSolicitud'>>): PedidoPendiente | undefined => {
  const index = pedidos.findIndex(p => p.id === id);

  if (index === -1) return undefined;

  const pedidoActualizado = {
    ...pedidos[index],
    ...datosActualizados
  };

  pedidos[index] = pedidoActualizado;
  return pedidoActualizado;
};

/**
 * Actualiza el estado de un pedido
 */
export const actualizarEstadoPedido = (id: string, estado: PedidoPendiente['estado']): PedidoPendiente | undefined => {
  return actualizarPedido(id, { estado });
};

/**
 * Elimina un pedido por su ID
 */
export const eliminarPedido = (id: string): boolean => {
  const pedidosAnteriores = pedidos.length;
  pedidos = pedidos.filter(p => p.id !== id);
  return pedidosAnteriores > pedidos.length;
};

/**
 * Marca un pedido como entregado y actualiza el stock si es necesario
 */
export const marcarPedidoComoEntregado = (id: string): PedidoPendiente | undefined => {
  const pedido = obtenerPedidoPorId(id);
  if (!pedido) return undefined;

  // Si el pedido estaba pendiente (no disponible), reducir el stock del producto
  if (pedido.estado === 'pendiente') {
    const producto = obtenerProductoPorId(pedido.productoId);
    if (producto) {
      actualizarStock(producto.id, Math.max(0, producto.stock - pedido.cantidad));
    }
  }

  return actualizarEstadoPedido(id, 'entregado');
};

/**
 * Verifica todos los pedidos pendientes contra el stock actual
 * y actualiza su estado si hay disponibilidad
 */
export const verificarDisponibilidadPedidos = (): PedidoPendiente[] => {
  const pedidosActualizados: PedidoPendiente[] = [];

  const pedidosPendientes = obtenerPedidosPorEstado('pendiente');

  for (const pedido of pedidosPendientes) {
    if (!pedido.producto) continue;

    // Si hay suficiente stock, marcar como disponible
    if (pedido.producto.stock >= pedido.cantidad) {
      const pedidoActualizado = actualizarEstadoPedido(pedido.id, 'disponible');
      if (pedidoActualizado) {
        pedidosActualizados.push(pedidoActualizado);
      }
    }
  }

  return pedidosActualizados;
};

/**
 * Verifica si hay pedidos pendientes que se pueden satisfacer
 * después de actualizar el stock de un producto específico
 */
export const verificarPedidosPorProducto = (productoId: string): PedidoPendiente[] => {
  const pedidosActualizados: PedidoPendiente[] = [];
  const producto = obtenerProductoPorId(productoId);

  if (!producto) return pedidosActualizados;

  const pedidosPendientes = obtenerPedidosPendientesPorProducto(productoId);

  // Ordenar pedidos por fecha (más antiguos primero)
  const pedidosOrdenados = [...pedidosPendientes].sort((a, b) =>
    new Date(a.fechaSolicitud).getTime() - new Date(b.fechaSolicitud).getTime()
  );

  let stockDisponible = producto.stock;

  // Intentar satisfacer pedidos hasta agotar el stock disponible
  for (const pedido of pedidosOrdenados) {
    if (stockDisponible >= pedido.cantidad) {
      // Actualizar el estado del pedido a disponible
      const pedidoActualizado = actualizarEstadoPedido(pedido.id, 'disponible');

      if (pedidoActualizado) {
        pedidosActualizados.push({
          ...pedidoActualizado,
          cliente: obtenerClientePorId(pedido.clienteId),
          producto
        });

        // Reducir el stock disponible para cálculos
        stockDisponible -= pedido.cantidad;
      }
    }
  }

  return pedidosActualizados;
};

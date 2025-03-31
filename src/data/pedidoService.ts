import { PedidoPendiente, ProductoPedido } from '@/types';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { obtenerClientePorId, obtenerClientes } from './clienteService';
import { obtenerProductoPorId, obtenerProductos, actualizarStock } from './productoService';

const pedidosRef = collection(db, 'pedidos');

/**
 * Obtener todos los pedidos (sin enriquecer)
 */
export const obtenerPedidos = async (): Promise<PedidoPendiente[]> => {
  const snapshot = await getDocs(pedidosRef);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      clienteId: data.clienteId,
      productos: data.productos,
      fechaSolicitud: data.fechaSolicitud?.toDate().toISOString().split('T')[0] ?? '',
      estado: data.estado,
    };
  });
};

/**
 * Obtener un pedido por ID
 */
export const obtenerPedidoPorId = async (id: string): Promise<PedidoPendiente | null> => {
  const ref = doc(db, 'pedidos', id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();
  return {
    id: snap.id,
    clienteId: data.clienteId,
    productos: data.productos,
    fechaSolicitud: data.fechaSolicitud?.toDate().toISOString().split('T')[0] ?? '',
    estado: data.estado,
  };
};

/**
 * Crear un pedido nuevo con múltiples productos
 */
export const crearPedido = async (
  pedido: Omit<PedidoPendiente, 'id' | 'fechaSolicitud' | 'estado'>
): Promise<PedidoPendiente> => {
  const estado: PedidoPendiente['estado'] = await Promise.all(
    pedido.productos.map(async (pp) => {
      const producto = await obtenerProductoPorId(pp.productoId);
      return producto && producto.stock >= pp.cantidad;
    })
  ).then((resultados) => (resultados.every(Boolean) ? 'disponible' : 'pendiente'));

  const docRef = await addDoc(pedidosRef, {
    clienteId: pedido.clienteId,
    productos: pedido.productos,
    fechaSolicitud: Timestamp.now(),
    estado,
  });

  if (estado === 'disponible') {
    for (const pp of pedido.productos) {
      const producto = await obtenerProductoPorId(pp.productoId);
      if (producto) {
        await actualizarStock(pp.productoId, producto.stock - pp.cantidad);
      }
    }
  }

  return {
    id: docRef.id,
    ...pedido,
    fechaSolicitud: new Date().toISOString().split('T')[0],
    estado,
  };
};

/**
 * Actualiza solo el estado de un pedido
 */
export const actualizarEstadoPedido = async (
  id: string,
  estado: PedidoPendiente['estado']
): Promise<void> => {
  const ref = doc(db, 'pedidos', id);
  await updateDoc(ref, { estado });
};

/**
 * Eliminar un pedido por ID
 */
export const eliminarPedido = async (id: string): Promise<void> => {
  const ref = doc(db, 'pedidos', id);
  await deleteDoc(ref);
};

/**
 * ✅ Obtiene los pedidos con cliente y productos enriquecidos
 */
export const obtenerPedidosConDetalles = async (): Promise<PedidoPendiente[]> => {
  const [clientes, productos, pedidos] = await Promise.all([
    obtenerClientes(),
    obtenerProductos(),
    obtenerPedidos(),
  ]);

  return pedidos.map((pedido) => {
    const cliente = clientes.find((c) => c.id === pedido.clienteId);

    const productosConDetalles: ProductoPedido[] = pedido.productos.map((pp) => {
      const producto = productos.find((p) => p.id === pp.productoId);
      return {
        ...pp,
        producto,
      };
    });

    return {
      ...pedido,
      cliente,
      productos: productosConDetalles,
    };
  });
};

export const verificarPedidosPorProducto = async (productoId: string): Promise<PedidoPendiente[]> => {
  const pedidos = await obtenerPedidos();
  const disponibles: PedidoPendiente[] = [];

  for (const pedido of pedidos) {
    if (pedido.estado !== 'pendiente') continue;

    // Verificar si este pedido incluye el producto
    const incluyeProducto = pedido.productos.some(p => p.productoId === productoId);
    if (!incluyeProducto) continue;

    // Verificar si todo el pedido puede completarse
    const completo = await Promise.all(
      pedido.productos.map(async (pp) => {
        const prod = await obtenerProductoPorId(pp.productoId);
        return prod && prod.stock >= pp.cantidad;
      })
    ).then((r) => r.every(Boolean));

    if (completo) {
      await actualizarEstadoPedido(pedido.id, 'disponible');
      disponibles.push({ ...pedido, estado: 'disponible' });
    }
  }

  return disponibles;
};

/**
 * Marca un pedido como entregado y ajusta el stock si estaba pendiente
 */
export const marcarPedidoComoEntregado = async (
  pedidoId: string
): Promise<void> => {
  const pedido = await obtenerPedidoPorId(pedidoId);
  if (!pedido) return;

  if (pedido.estado === 'pendiente') {
    for (const pp of pedido.productos) {
      const producto = await obtenerProductoPorId(pp.productoId);
      if (producto) {
        const nuevoStock = Math.max(0, producto.stock - pp.cantidad);
        await actualizarStock(pp.productoId, nuevoStock);
      }
    }
  }

  await actualizarEstadoPedido(pedidoId, 'entregado');
};

/**
 * ✅ Verifica si hay pedidos pendientes que ahora pueden pasar a disponibles
 */
export const verificarDisponibilidadPedidos = async (): Promise<PedidoPendiente[]> => {
  const pedidos = await obtenerPedidos();
  const disponibles: PedidoPendiente[] = [];

  for (const pedido of pedidos) {
    if (pedido.estado !== 'pendiente') continue;

    let puedeSerDisponible = true;

    for (const pp of pedido.productos) {
      const producto = await obtenerProductoPorId(pp.productoId);
      if (!producto || producto.stock < pp.cantidad) {
        puedeSerDisponible = false;
        break;
      }
    }

    if (puedeSerDisponible) {
      await actualizarEstadoPedido(pedido.id, 'disponible');
      disponibles.push({ ...pedido, estado: 'disponible' });
    }
  }

  return disponibles;
};


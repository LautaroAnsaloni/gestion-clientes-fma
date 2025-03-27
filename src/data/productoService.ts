import { Producto } from '@/types';
import { productos as productosIniciales } from './mockData';
import { verificarPedidosPorProducto } from './pedidoService';

// Usamos un array mutable para simular una base de datos
let productos = [...productosIniciales];

/**
 * Obtiene todos los productos
 */
export const obtenerProductos = (): Producto[] => {
  return [...productos];
};

/**
 * Obtiene un producto por su ID
 */
export const obtenerProductoPorId = (id: string): Producto | undefined => {
  return productos.find(p => p.id === id);
};

/**
 * Crea un nuevo producto
 */
export const crearProducto = (producto: Omit<Producto, 'id'>): Producto => {
  const nuevoProducto: Producto = {
    ...producto,
    id: (productos.length + 1).toString(),
  };

  productos.push(nuevoProducto);
  return nuevoProducto;
};

/**
 * Actualiza un producto existente
 */
export const actualizarProducto = (id: string, datosActualizados: Partial<Omit<Producto, 'id'>>): Producto | undefined => {
  const index = productos.findIndex(p => p.id === id);

  if (index === -1) return undefined;

  const productoActualizado = {
    ...productos[index],
    ...datosActualizados
  };

  productos[index] = productoActualizado;

  // Si se actualizó el stock, verificar pedidos pendientes
  if (typeof datosActualizados.stock !== 'undefined') {
    verificarPedidosPorProducto(id);
  }

  return productoActualizado;
};

/**
 * Actualiza solamente el stock de un producto
 * @returns Un objeto con el producto actualizado y los pedidos que ahora pueden satisfacerse
 */
export const actualizarStock = (id: string, stock: number): {
  producto?: Producto;
  pedidosSatisfechos: ReturnType<typeof verificarPedidosPorProducto>;
} => {
  const productoActualizado = actualizarProducto(id, { stock });

  if (!productoActualizado) {
    return { producto: undefined, pedidosSatisfechos: [] };
  }

  // Verificar si hay pedidos pendientes que ahora pueden satisfacerse
  const pedidosSatisfechos = verificarPedidosPorProducto(id);

  return {
    producto: productoActualizado,
    pedidosSatisfechos
  };
};

/**
 * Elimina un producto por su ID
 */
export const eliminarProducto = (id: string): boolean => {
  const productosAnteriores = productos.length;
  productos = productos.filter(p => p.id !== id);
  return productosAnteriores > productos.length;
};

import { Cliente } from '@/types';
import { clientes as clientesIniciales } from './mockData';

// Usamos un array mutable para simular una base de datos
let clientes = [...clientesIniciales];

/**
 * Obtiene todos los clientes
 */
export const obtenerClientes = (): Cliente[] => {
  return [...clientes];
};

/**
 * Obtiene un cliente por su ID
 */
export const obtenerClientePorId = (id: string): Cliente | undefined => {
  return clientes.find(c => c.id === id);
};

/**
 * Crea un nuevo cliente
 */
export const crearCliente = (cliente: Omit<Cliente, 'id' | 'fechaRegistro'>): Cliente => {
  const nuevoCliente: Cliente = {
    ...cliente,
    id: (clientes.length + 1).toString(),
    fechaRegistro: new Date().toISOString().split('T')[0]
  };

  clientes.push(nuevoCliente);
  return nuevoCliente;
};

/**
 * Actualiza un cliente existente
 */
export const actualizarCliente = (id: string, datosActualizados: Partial<Omit<Cliente, 'id' | 'fechaRegistro'>>): Cliente | undefined => {
  const index = clientes.findIndex(c => c.id === id);

  if (index === -1) return undefined;

  const clienteActualizado = {
    ...clientes[index],
    ...datosActualizados
  };

  clientes[index] = clienteActualizado;
  return clienteActualizado;
};

/**
 * Elimina un cliente por su ID
 */
export const eliminarCliente = (id: string): boolean => {
  const clientesAnteriores = clientes.length;
  clientes = clientes.filter(c => c.id !== id);
  return clientesAnteriores > clientes.length;
};

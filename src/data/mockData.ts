import { Cliente, Producto, PedidoPendiente } from '@/types';

// Datos de muestra para clientes
export const clientes: Cliente[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    telefono: '+54 11 1234-5678',
    email: 'juan.perez@ejemplo.com',
    fechaRegistro: '2023-10-15',
  },
  {
    id: '2',
    nombre: 'María López',
    telefono: '+54 11 2345-6789',
    email: 'maria.lopez@ejemplo.com',
    fechaRegistro: '2023-11-05',
  },
  {
    id: '3',
    nombre: 'Carlos Rodríguez',
    telefono: '+54 11 3456-7890',
    email: 'carlos.rodriguez@ejemplo.com',
    fechaRegistro: '2023-12-20',
  },
];

// Datos de muestra para productos
export const productos: Producto[] = [
  {
    id: '1',
    nombre: 'Laptop Dell XPS 13',
    descripcion: 'Laptop de alta gama con procesador Intel i7',
    precio: 1200000,
    stock: 5,
  },
  {
    id: '2',
    nombre: 'iPhone 14 Pro',
    descripcion: 'Smartphone Apple de última generación',
    precio: 950000,
    stock: 0,
  },
  {
    id: '3',
    nombre: 'Monitor Samsung 27"',
    descripcion: 'Monitor 4K con panel IPS',
    precio: 350000,
    stock: 3,
  },
  {
    id: '4',
    nombre: 'Teclado mecánico Logitech',
    descripcion: 'Teclado gaming con switches Cherry MX',
    precio: 120000,
    stock: 0,
  },
];

// Datos de muestra para pedidos pendientes
export const pedidosPendientes: PedidoPendiente[] = [
  {
    id: '1',
    clienteId: '1',
    productoId: '2',
    cantidad: 1,
    fechaSolicitud: '2024-03-10',
    estado: 'pendiente',
  },
  {
    id: '2',
    clienteId: '2',
    productoId: '4',
    cantidad: 2,
    fechaSolicitud: '2024-03-15',
    estado: 'pendiente',
  },
  {
    id: '3',
    clienteId: '3',
    productoId: '2',
    cantidad: 1,
    fechaSolicitud: '2024-03-20',
    estado: 'disponible',
  },
];

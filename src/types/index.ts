export interface Cliente {
  id: string;
  nombre: string;
  telefono: string;
  email: string;
  fechaRegistro: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface PedidoPendiente {
  id: string;
  clienteId: string;
  productoId: string;
  cantidad: number;
  fechaSolicitud: string;
  estado: 'pendiente' | 'disponible' | 'entregado';
  cliente?: Cliente;
  producto?: Producto;
}

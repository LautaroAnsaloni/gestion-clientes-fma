import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getEstadoClass(estado: 'pendiente' | 'disponible' | 'entregado'): string {
  switch (estado) {
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800';
    case 'disponible':
      return 'bg-green-100 text-green-800';
    case 'entregado':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export function getEstadoLabel(estado: 'pendiente' | 'disponible' | 'entregado'): string {
  switch (estado) {
    case 'pendiente':
      return 'Pendiente';
    case 'disponible':
      return 'Disponible';
    case 'entregado':
      return 'Entregado';
    default:
      return 'Desconocido';
  }
}

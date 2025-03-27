'use client';

import { ProductoForm } from '@/components/productos/producto-form';

export default function NuevoProductoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo Producto</h1>
      <div className="mx-auto max-w-2xl">
        <ProductoForm />
      </div>
    </div>
  );
}

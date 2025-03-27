'use client';

import { ClienteForm } from '@/components/clientes/cliente-form';

export default function NuevoClientePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo Cliente</h1>
      <div className="mx-auto max-w-2xl">
        <ClienteForm />
      </div>
    </div>
  );
}

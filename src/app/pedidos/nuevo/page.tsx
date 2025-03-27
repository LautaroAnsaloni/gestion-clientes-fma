'use client';

import { PedidoForm } from '@/components/pedidos/pedido-form';

export default function NuevoPedidoPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Nuevo Pedido</h1>
      <div className="mx-auto max-w-2xl">
        <PedidoForm />
      </div>
    </div>
  );
}

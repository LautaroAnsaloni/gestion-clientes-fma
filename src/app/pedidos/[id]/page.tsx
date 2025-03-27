'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PedidoPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/pedidos');
  }, [router]);

  return (
    <div className="flex h-40 items-center justify-center">
      <p>Redireccionando...</p>
    </div>
  );
}

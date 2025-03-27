'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductoPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/productos');
  }, [router]);

  return (
    <div className="flex h-40 items-center justify-center">
      <p>Redireccionando...</p>
    </div>
  );
}

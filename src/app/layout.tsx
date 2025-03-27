import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { Notifications } from '@/components/ui/notifications';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gestor de Clientes y Pedidos',
  description: 'Aplicación para gestionar clientes y pedidos pendientes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
            <div className="container flex h-14 items-center">
              <div className="mr-4 hidden md:flex">
                <Link className="mr-6 flex items-center space-x-2" href="/">
                  <span className="font-bold">Gestor de Clientes y Pedidos</span>
                </Link>
                <nav className="flex items-center space-x-6 text-sm font-medium">
                  <Link
                    href="/"
                    className="transition-colors hover:text-foreground/80"
                  >
                    Inicio
                  </Link>
                  <Link
                    href="/clientes"
                    className="transition-colors hover:text-foreground/80"
                  >
                    Clientes
                  </Link>
                  <Link
                    href="/productos"
                    className="transition-colors hover:text-foreground/80"
                  >
                    Productos
                  </Link>
                  <Link
                    href="/pedidos"
                    className="transition-colors hover:text-foreground/80"
                  >
                    Pedidos
                  </Link>
                </nav>
              </div>
            </div>
          </header>
          <main className="container flex-1 py-6">
            {children}
          </main>
          <Notifications />
        </div>
      </body>
    </html>
  );
}

import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cliente } from '@/types';

interface RecentClientsProps {
  clients: Cliente[];
}

export function RecentClients({ clients }: RecentClientsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center space-x-4 rounded-md border p-3"
            >
              <Avatar>
                <AvatarFallback>
                  {client.nombre
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{client.nombre}</p>
                <p className="text-xs text-muted-foreground">{client.email}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                {new Date(client.fechaRegistro).toLocaleDateString('es-AR')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

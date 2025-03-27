'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface QuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function QuickAction({ title, description, icon: Icon, onClick }: QuickActionProps) {
  return (
    <Button
      variant="outline"
      className="flex h-auto flex-col items-start gap-1 p-4 text-left"
      onClick={onClick}
    >
      <div className="flex w-full items-center gap-2">
        <Icon className="h-5 w-5" />
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </Button>
  );
}

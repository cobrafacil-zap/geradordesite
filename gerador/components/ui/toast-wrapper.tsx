'use client';

import { ToastProvider } from '@/components/ui/toast';

/**
 * Client-side wrapper para que o ToastProvider fique disponível em toda a app,
 * inclusive em rotas fora do dashboard (login, página raiz).
 */
export function ToastWrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

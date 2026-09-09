/**
 * Dashboard — landing do Gerador.
 *
 * Vive em `/dashboard` (sub-rota) em vez de `/` para evitar o bug do
 * Next 14 onde `app/(group)/page.tsx` raiz não gera o
 * `client-reference-manifest.js` em build serverless da Vercel.
 */
'use client';

import { DashboardContent } from '../_components/dashboard-content';

export default function DashboardPage() {
  return <DashboardContent />;
}

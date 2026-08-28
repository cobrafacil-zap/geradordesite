import type { Metadata } from 'next';
import './globals.css';
import { ToastWrapper } from '@/components/ui/toast-wrapper';

export const metadata: Metadata = {
  title: 'Fábrica de Sites — Gerador',
  description: 'Gere sites reais para clientes em minutos. Modelos profissionais, IA, exportação completa.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <ToastWrapper>{children}</ToastWrapper>
      </body>
    </html>
  );
}

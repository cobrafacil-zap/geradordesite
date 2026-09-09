/**
 * Helper local de link WhatsApp para a LP pública.
 * Duplicado intencionalmente — o `waLink` em `lib/generator/templates/components/registry.tsx`
 * é client-only (`'use client'`) e não pode ser importado em server component.
 * Manter sincronizado se a função canônica mudar.
 */
export function waLink(num: string, msg?: string): string {
  const digits = String(num || '').replace(/\D/g, '');
  const text = msg ? `?text=${encodeURIComponent(msg)}` : '';
  return `https://wa.me/${digits}${text}`;
}

/** Número canônico da Social Marketing BR (formato wa.me: 55 + DDD + número). */
export const WHATSAPP = '5543996820296';

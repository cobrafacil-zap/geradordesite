/**
 * Renderer type — cada componente recebe { content, settings, theme } e retorna JSX.
 */
import type { CSSProperties, ReactNode } from 'react';

export interface RendererProps {
  content: Record<string, any>;
  settings?: Record<string, any>;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
  };
  assets?: Record<string, string>;
  nav?: Array<{ label: string; href: string }>;
  siteName?: string;
}

export type Renderer = (props: RendererProps) => ReactNode;

/** Helper: monta um style baseado no tema */
export function tStyles(theme: RendererProps['theme']): CSSProperties {
  return {
    '--c-primary': theme.primary,
    '--c-secondary': theme.secondary,
    '--c-accent': theme.accent,
    '--c-bg': theme.background,
    '--c-surface': theme.surface,
    '--c-text': theme.text,
    '--c-text-muted': theme.textMuted,
    '--c-border': theme.border,
  } as CSSProperties;
}

/** Helper: link WhatsApp */
export function waLink(num: string | undefined, msg?: string): string {
  if (!num) return '#';
  const digits = String(num).replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(msg || 'Olá, gostaria de saber mais.')}`;
}

/** Helper: ícone simples (chevron, check, etc.) */
export function Chevron({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function Check({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

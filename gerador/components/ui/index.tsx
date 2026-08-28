'use client';

import { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode, forwardRef } from 'react';

/* ────────────────────────────────────────────────────────────────
   UI Primitives — Fábrica de Sites
   Estilo dark-first, sem dependências externas (sem shadcn).
   ──────────────────────────────────────────────────────────────── */

// ── Button ──────────────────────────────────────────────────────
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

const variants: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2.5',
  lg: 'text-base px-6 py-3.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, icon, children, className = '', disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...rest}
    >
      {loading ? <Spinner size={14} /> : icon}
      {children}
    </button>
  );
});

// ── Input ───────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className = '', ...rest },
  ref,
) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-fg-muted mb-1.5">{label}</span>}
      <input
        ref={ref}
        className={`w-full bg-bg-elev border ${error ? 'border-danger' : 'border-border'} rounded-lg px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors ${className}`}
        {...rest}
      />
      {hint && !error && <span className="block text-xs text-fg-dim mt-1">{hint}</span>}
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  );
});

// ── Textarea ────────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className = '', rows = 4, ...rest },
  ref,
) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-fg-muted mb-1.5">{label}</span>}
      <textarea
        ref={ref}
        rows={rows}
        className={`w-full bg-bg-elev border ${error ? 'border-danger' : 'border-border'} rounded-lg px-3.5 py-2.5 text-sm text-fg placeholder:text-fg-dim resize-y focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors ${className}`}
        {...rest}
      />
      {hint && !error && <span className="block text-xs text-fg-dim mt-1">{hint}</span>}
      {error && <span className="block text-xs text-danger mt-1">{error}</span>}
    </label>
  );
});

// ── Select ──────────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, hint, className = '', children, ...rest },
  ref,
) {
  return (
    <label className="block">
      {label && <span className="block text-xs font-medium text-fg-muted mb-1.5">{label}</span>}
      <select
        ref={ref}
        className={`w-full bg-bg-elev border border-border rounded-lg px-3.5 py-2.5 text-sm text-fg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors ${className}`}
        {...rest}
      >
        {children}
      </select>
      {hint && <span className="block text-xs text-fg-dim mt-1">{hint}</span>}
    </label>
  );
});

// ── Card ────────────────────────────────────────────────────────
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}
export function Card({ children, className = '', hover = true }: CardProps) {
  return <div className={`card-base p-5 ${hover ? '' : ''} ${className}`}>{children}</div>;
}

// ── Badge ───────────────────────────────────────────────────────
type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'accent';

export function Badge({ children, variant = 'default', className = '' }: { children: ReactNode; variant?: BadgeVariant; className?: string }) {
  const styles: Record<BadgeVariant, string> = {
    default: 'bg-bg-elev2 text-fg-muted border-border',
    success: 'bg-success/15 text-success border-success/30',
    warning: 'bg-warning/15 text-warning border-warning/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
    accent: 'bg-accent/15 text-accent border-accent/30',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

// ── Spinner ─────────────────────────────────────────────────────
export function Spinner({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 800ms linear infinite' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </svg>
  );
}

// ── Skeleton ────────────────────────────────────────────────────
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-bg-elev2 rounded animate-pulse ${className}`} />;
}

// ── EmptyState ──────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      {icon && <div className="mb-4 text-fg-dim">{icon}</div>}
      <h3 className="text-lg font-semibold text-fg mb-1">{title}</h3>
      {description && <p className="text-sm text-fg-muted max-w-md mb-5">{description}</p>}
      {action}
    </div>
  );
}

// ── Confirm ─────────────────────────────────────────────────────
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onCancel}>
      <div className="card-base max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-fg mb-2">{title}</h3>
        <p className="text-sm text-fg-muted mb-6">{message}</p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

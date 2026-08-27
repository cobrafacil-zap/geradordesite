'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Icon } from '@/components/dashboard/sidebar';

export type ToastKind = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  kind: ToastKind;
  title: string;
  description?: string;
  /** Duração em ms (0 = não fecha sozinho). */
  duration?: number;
  /** Ação opcional (ex: "Tentar novamente"). */
  action?: { label: string; onClick: () => void };
}

interface ToastContextValue {
  toasts: Toast[];
  show: (t: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  success: (title: string, description?: string) => string;
  error: (title: string, description?: string) => string;
  warning: (title: string, description?: string) => string;
  info: (title: string, description?: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((t: Omit<Toast, 'id'>) => {
    const id = 'toast-' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
    const toast: Toast = { duration: 5000, ...t, id };
    setToasts((cur) => [...cur, toast]);
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => dismiss(id), toast.duration);
    }
    return id;
  }, [dismiss]);

  const success = useCallback((title: string, description?: string) => show({ kind: 'success', title, description }), [show]);
  const error = useCallback((title: string, description?: string) => show({ kind: 'error', title, description, duration: 7000 }), [show]);
  const warning = useCallback((title: string, description?: string) => show({ kind: 'warning', title, description }), [show]);
  const info = useCallback((title: string, description?: string) => show({ kind: 'info', title, description }), [show]);

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss, success, error, warning, info }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback silencioso se provider ausente — não quebra SSR
    const noop = () => '';
    const noopVoid = () => {};
    return {
      toasts: [],
      show: noop,
      dismiss: noopVoid,
      success: noop,
      error: noop,
      warning: noop,
      info: noop,
    };
  }
  return ctx;
}

function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map((t) => <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />)}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const styles: Record<ToastKind, { bg: string; border: string; icon: string; iconName: string }> = {
    success: { bg: 'bg-success/15', border: 'border-success/40', icon: 'text-success', iconName: 'check' },
    error:   { bg: 'bg-danger/15',  border: 'border-danger/40',  icon: 'text-danger',  iconName: 'x' },
    warning: { bg: 'bg-warning/15', border: 'border-warning/40', icon: 'text-warning', iconName: '!' },
    info:    { bg: 'bg-accent/15',  border: 'border-accent/40',  icon: 'text-accent',  iconName: 'sparkles' },
  };
  const s = styles[toast.kind];
  return (
    <div
      role="alert"
      className={`pointer-events-auto ${s.bg} ${s.border} border rounded-lg p-4 backdrop-blur shadow-lg flex items-start gap-3 animate-slideIn`}
      style={{ animation: 'slideIn 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      <div className={`flex-shrink-0 ${s.icon} font-bold w-5 h-5 flex items-center justify-center`}>
        {toast.kind === 'success' && <Icon name="check" size={14} />}
        {toast.kind === 'error' && <Icon name="x" size={14} />}
        {toast.kind === 'warning' && <span>!</span>}
        {toast.kind === 'info' && <Icon name="sparkles" size={14} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-fg">{toast.title}</div>
        {toast.description && <div className="text-xs text-fg-muted mt-0.5">{toast.description}</div>}
        {toast.action && (
          <button
            onClick={() => { toast.action!.onClick(); onDismiss(toast.id); }}
            className="text-xs font-medium text-accent hover:underline mt-1.5"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button onClick={() => onDismiss(toast.id)} className="text-fg-dim hover:text-fg p-0.5">
        <Icon name="x" size={12} />
      </button>
    </div>
  );
}

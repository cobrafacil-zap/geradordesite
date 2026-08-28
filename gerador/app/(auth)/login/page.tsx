'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card } from '@/components/ui';
import { useToast } from '@/components/ui/toast';

export default function LoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        redirect: 'manual', // nunca seguir redirect de middleware/proxy — queremos ver o status real
        body: JSON.stringify({ email, password, fullName: fullName || undefined }),
      });
      // redirect 30x vindo de middleware/proxy → tratar como falha
      if (res.status >= 300 && res.status < 400) {
        setError('Sessão expirada. Recarregue a página e tente novamente.');
        return;
      }
      const text = await res.text();
      let data: any = {};
      if (text) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          try { data = JSON.parse(text); } catch { data = { error: `Resposta inválida do servidor (HTTP ${res.status})` }; }
        } else {
          // veio HTML (página de erro, redirect seguido, etc)
          data = { error: `Resposta inesperada do servidor (HTTP ${res.status}). Tente novamente.` };
        }
      }
      if (!res.ok) {
        setError(data.error || `Falha na autenticação (HTTP ${res.status})`);
        toast.error(mode === 'login' ? 'Falha no login' : 'Falha no cadastro', data.error);
        return;
      }
      toast.success(mode === 'login' ? 'Bem-vindo de volta!' : 'Conta criada');
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Erro de rede');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center text-white font-bold">
            F
          </div>
          <div>
            <div className="text-base font-semibold text-fg">Fábrica de Sites</div>
            <div className="text-[10px] text-fg-dim uppercase tracking-wider">Gerador Real</div>
          </div>
        </Link>

        <Card hover={false}>
          <div className="flex gap-1 bg-bg-elev2 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'login' ? 'bg-bg-elev text-fg' : 'text-fg-muted hover:text-fg'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                mode === 'signup' ? 'bg-bg-elev text-fg' : 'text-fg-muted hover:text-fg'
              }`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Nome completo"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
              />
            )}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@empresa.com"
              required
              autoComplete="email"
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              hint={mode === 'signup' ? 'Mínimo 6 caracteres' : undefined}
            />

            {error && (
              <div className="text-xs text-danger bg-danger/10 border border-danger/20 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" loading={loading} className="w-full">
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <p className="text-xs text-fg-dim text-center mt-6">
            Ao continuar, você concorda com os termos de uso.
          </p>
        </Card>
      </div>
    </div>
  );
}

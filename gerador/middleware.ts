import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware principal — NUNCA quebra, sempre retorna NextResponse.
 *
 * Em dev (sem Supabase) → deixa passar tudo.
 * Em produção → verifica sessão Supabase e redireciona para /login se preciso.
 *
 * Public paths são acessíveis sem login.
 * Em caso de QUALQUER erro (Supabase offline, key inválida, etc) → deixa passar
 * (o componente Server faz fallback com try/catch).
 */

const PUBLIC_PATHS = [
  '/login',
  '/setup',
  '/auth/callback',
  '/auth/confirm',
  '/api/auth', // login/signup/logout/callback — nunca redirecionar (são endpoints que o cliente chama)
  '/api/health',
  '/api/preview', // preview iframe (autenticação tratada no route handler)
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/') || pathname.startsWith(p + '?'));
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Sem env vars configuradas → modo dev, deixa tudo passar
  if (!url || !anonKey) return response;

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) {
          try { response.cookies.set({ name, value, ...options }); } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { response.cookies.set({ name, value: '', ...options }); } catch {}
        },
      },
    });

    const { data: { session } } = await supabase.auth.getSession();

    const pathname = request.nextUrl.pathname;
    const publicPath = isPublic(pathname);

    if (!session && !publicPath) {
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (session && (pathname === '/login' || pathname === '/')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } catch (err) {
    // NUNCA deixar o middleware quebrar — apenas log e segue
    console.error('Middleware error (ignored):', err);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Aplica em tudo, exceto internals do Next.js e arquivos estáticos.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
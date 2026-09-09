import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware principal — NUNCA quebra, sempre retorna NextResponse.
 *
 * Em dev (sem Supabase) → deixa passar tudo.
 * Em produção → verifica sessão Supabase. Rotas não-públicas (incluindo /admin)
 * são PROTEGIDAS, mas **sem redirecionar pra /login** — isso evitaria
 * "denunciar" que existe um painel. Em vez disso, o middleware deixa passar
 * e o layout (admin) chama `notFound()` quando a sessão é inválida.
 *
 * Public paths são acessíveis sem login.
 * Em caso de QUALQUER erro (Supabase offline, key inválida, etc) → deixa passar
 * (o componente Server faz fallback com try/catch).
 */

const PUBLIC_PATHS = [
  '/login',
  '/setup',
  '/lp', // landing page pública de pré-qualificação (Social Marketing BR)
  '/auth/callback',
  '/auth/confirm',
  '/api/auth', // login/signup/logout/callback — nunca redirecionar (são endpoints que o cliente chama)
  '/api/health',
  '/api/preview', // preview iframe (autenticação tratada no route handler)
  '/api/template-preview', // preview de modelos no /models (público, sem auth)
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

    // Raiz / sempre vai pra LP pública. Visitante e logado caem na LP —
    // o dono do painel usa /admin/dashboard direto (não passa por /).
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/lp', request.url));
    }

    // /login é página pública. Se o usuário está logado e cai em /login,
    // manda pro admin. (Sem redirect pra /login a partir de rotas
    // protegidas — /admin/* responde 404 via notFound() no layout.)
    if (session && pathname === '/login') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
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
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  experimental: {
    serverActions: { bodySizeLimit: '10mb' },
  },
  // Renomeação do painel para /admin (antigo /(dashboard)).
  // URLs antigas redirecionam 308 (permanente) para /admin/...
  // A raiz / vai pra LP pública /lp.
  // /admin (sem path) também cai na LP — só /admin/login (público) e
  // /admin/dashboard+ (autenticado) é que respondem.
  // O /admin/login está em PUBLIC_PATHS (middleware) pra não bater em 404.
  async redirects() {
    return [
      { source: '/', destination: '/lp', permanent: false },
      { source: '/admin', destination: '/lp', permanent: false },
      { source: '/projects', destination: '/admin/projects', permanent: true },
      { source: '/projects/:path*', destination: '/admin/projects/:path*', permanent: true },
      { source: '/models', destination: '/admin/models', permanent: true },
      { source: '/clients', destination: '/admin/clients', permanent: true },
      { source: '/settings', destination: '/admin/settings', permanent: true },
      { source: '/media', destination: '/admin/media', permanent: true },
      { source: '/dashboard', destination: '/admin/dashboard', permanent: true },
    ];
  },
};

export default nextConfig;

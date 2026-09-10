'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * ModelPreviewFrame — mostra a PRIMEIRA TELA real do site gerado
 * dentro de um iframe escalado, dentro do card. Diferente do gradiente
 * fake anterior, aqui o visitante vê o site real (Hero + primeiras seções
 * do segmento) e sente que cada modelo é realmente diferente.
 *
 * Estratégia de performance:
 * - Lazy mount: só renderiza o iframe quando o card entra na viewport
 *  (IntersectionObserver) — não baixa 10 iframes ao mesmo tempo
 * - transform: scale(0.28) sobre iframe width 1280 → ~360px visível
 * - Sem `srcDoc`, usa URL real /api/template-preview/[slug] pra ser cacheável
 *   pelo navegador e CDN
 */
export function ModelPreviewFrame({ slug, color, label }: { slug: string; color: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden bg-slate-950"
      style={{ background: `linear-gradient(135deg, ${color} 0%, #0f172a 100%)` }}
    >
      {visible ? (
        <>
          <div
            className="absolute top-0 left-0 pointer-events-none"
            style={{
              width: 1280,
              height: 960,
              transformOrigin: 'top left',
              transform: 'scale(0.3)',
            }}
          >
            <iframe
              src={`/api/template-preview/${slug}`}
              title={`Preview de ${label}`}
              className="w-full h-full border-0 bg-white"
              style={{ width: 1280, height: 960 }}
              loading="lazy"
              onLoad={() => setLoaded(true)}
              tabIndex={-1}
            />
          </div>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xs text-white/60 flex items-center gap-2">
                <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Carregando preview…
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/40 text-xs">
          Aguardando…
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Card, Badge } from '@/components/ui';
import { Icon } from '@/components/dashboard/sidebar';

type Template = {
  slug: string;
  name: string;
  category: string;
  tag: string;
  emoji: string;
  color: string;
};

const FALLBACK_GRADIENT = (color: string) =>
  `linear-gradient(135deg, ${color}22 0%, ${color}66 100%)`;

export function ModelCard({ template }: { template: Template }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const previewUrl = `/api/template-preview/${template.slug}`;

  // Lazy: só monta o iframe quando o card entra em viewport
  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShouldLoad(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin: '200px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Card hover={false} className="!p-0 overflow-hidden group flex flex-col">
      <div
        ref={wrapRef}
        className="aspect-[4/3] relative overflow-hidden bg-bg-elev2"
        style={{ background: FALLBACK_GRADIENT(template.color) }}
      >
        {/* Preview iframe — lazy */}
        {shouldLoad && (
          <iframe
            key={template.slug}
            src={previewUrl}
            title={`Preview ${template.name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              // Escala visual para preencher melhor o card
              transform: 'scale(0.32)',
              transformOrigin: 'top left',
              width: '312%',
              height: '312%',
              pointerEvents: 'none',
            }}
          />
        )}
        {/* Skeleton enquanto iframe não terminou de carregar */}
        {shouldLoad && !loaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20 animate-pulse">
              {template.emoji}
            </div>
          </div>
        )}
        <Badge variant="default" className="absolute top-2 left-2 z-10">{template.tag}</Badge>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <h3 className="text-sm font-semibold text-fg">{template.name}</h3>
          <p className="text-xs text-fg-muted mt-0.5">/{template.slug}</p>
        </div>
        <div className="flex gap-2 mt-1">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary flex-1 text-xs py-2 flex items-center justify-center gap-1.5"
          >
            <Icon name="eye" size={12} /> Preview
          </a>
          <Link
            href={`/projects/new?template=${template.slug}`}
            className="btn-primary flex-1 text-xs py-2 flex items-center justify-center gap-1.5"
          >
            <Icon name="plus" size={12} /> Usar
          </Link>
        </div>
      </div>
    </Card>
  );
}
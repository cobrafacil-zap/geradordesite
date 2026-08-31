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
      {/*
        Container com altura fixa. Iframe com width 100% e height ~1500px
        (altura típica de um site). O container tem overflow-auto, então o
        usuário pode rolar pra ver o site inteiro, com toda a estrutura
        diferenciada por segmento (Properties, MenuFull, Gallery, etc.).
      */}
      <div
        ref={wrapRef}
        className="relative overflow-auto bg-white border-b border-border"
        style={{ height: 320 }}
      >
        {shouldLoad && (
          <iframe
            key={template.slug}
            src={previewUrl}
            title={`Preview ${template.name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            sandbox="allow-same-origin allow-scripts"
            onLoad={() => setLoaded(true)}
            className={`block border-0 transition-opacity duration-300 ${
              loaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              width: '100%',
              height: 1500,
              pointerEvents: 'auto',
            }}
          />
        )}
        {/* Skeleton enquanto iframe carrega */}
        {shouldLoad && !loaded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-bg-elev2">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl border border-white/20 animate-pulse">
              {template.emoji}
            </div>
          </div>
        )}
        {/* Tag do template no canto */}
        <Badge variant="default" className="absolute top-2 left-2 z-20">{template.tag}</Badge>
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
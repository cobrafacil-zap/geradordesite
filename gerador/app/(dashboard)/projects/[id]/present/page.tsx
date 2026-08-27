'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Icon } from '@/components/dashboard/sidebar';
import { Spinner } from '@/components/ui';

type Device = 'desktop' | 'tablet' | 'phone';

const DEVICES: Record<Device, { w: number; h: number; label: string }> = {
  desktop: { w: 1440, h: 900, label: 'Desktop' },
  tablet: { w: 768, h: 1024, label: 'Tablet' },
  phone: { w: 390, h: 844, label: 'Mobile' },
};

export default function PresentPage() {
  const params = useParams<{ id: string }>();
  const [device, setDevice] = useState<Device>('desktop');
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') window.close();
      if (e.key === 'f' || e.key === 'F') {
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen?.();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const dev = DEVICES[device];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Topbar */}
      <div className="h-12 bg-bg-elev/90 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href={`/projects/${params.id}/edit`} className="text-fg-muted hover:text-fg flex items-center gap-1.5 text-sm">
            <Icon name="arrow-left" size={14} /> Sair
          </Link>
        </div>
        <div className="flex items-center gap-1 bg-bg-elev2 rounded-lg p-1">
          {(Object.keys(DEVICES) as Device[]).map((d) => (
            <button
              key={d}
              onClick={() => setDevice(d)}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-md transition-colors ${
                device === d ? 'bg-bg-elev text-fg' : 'text-fg-muted hover:text-fg'
              }`}
            >
              <Icon name={d} size={12} />
              {DEVICES[d].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs">
            <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} className="btn-ghost text-xs px-2 py-1">−</button>
            <span className="text-fg-muted w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))} className="btn-ghost text-xs px-2 py-1">+</button>
          </div>
          <button
            onClick={() => document.documentElement.requestFullscreen?.()}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            <Icon name="maximize" size={12} /> Tela cheia
          </button>
        </div>
      </div>

      {/* Frame */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-6">
        <div
          className="bg-white rounded-xl shadow-2xl overflow-hidden border border-border"
          style={{
            width: dev.w * zoom,
            height: dev.h * zoom,
            maxWidth: '100%',
            maxHeight: '100%',
            transition: 'width 200ms, height 200ms',
          }}
        >
          <iframe
            src={`/api/preview/${params.id}`}
            className="w-full h-full bg-white"
            style={{ width: dev.w, height: dev.h, transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            title="Apresentação do site"
            sandbox="allow-same-origin allow-scripts allow-forms"
          />
        </div>
      </div>

      <div className="h-8 bg-bg-elev/90 border-t border-border flex items-center justify-center text-xs text-fg-dim">
        Pressione ESC para sair • F para tela cheia • {dev.w}×{dev.h}
      </div>
    </div>
  );
}

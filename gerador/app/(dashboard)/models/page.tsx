'use client';

import { useState } from 'react';
import { Input } from '@/components/ui';
import { ModelCard } from './_components/ModelCard';

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'institucional', name: 'Institucional' },
  { id: 'servicos', name: 'Serviços' },
  { id: 'comercio', name: 'Comércio' },
  { id: 'profissionais', name: 'Profissionais' },
];

export default function ModelsPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const templates = [
    { slug: 'empresa-corporativa', name: 'Empresa Corporativa', category: 'institucional', tag: 'B2B tradicional', emoji: '🏛️', color: '#1e40af' },
    { slug: 'empresa-moderna', name: 'Empresa Moderna', category: 'institucional', tag: 'Tech / SaaS', emoji: '⚡', color: '#7c5cff' },
    { slug: 'empresa-premium', name: 'Empresa Premium', category: 'institucional', tag: 'Luxo / Boutique', emoji: '💎', color: '#1f1f1f' },
    { slug: 'industria', name: 'Indústria', category: 'institucional', tag: 'Manufatura', emoji: '🏭', color: '#475569' },
    { slug: 'construtora', name: 'Construtora', category: 'institucional', tag: 'Obras e imóveis', emoji: '🏗️', color: '#b45309' },
    { slug: 'startup', name: 'Startup', category: 'institucional', tag: 'Inovação', emoji: '🚀', color: '#db2777' },
    { slug: 'empresa-local', name: 'Empresa Local', category: 'institucional', tag: 'Regional', emoji: '📍', color: '#0d9488' },
    { slug: 'escritorio-advocacia', name: 'Escritório de Advocacia', category: 'institucional', tag: 'Jurídico B2B', emoji: '⚖️', color: '#581c87' },
    { slug: 'clinica-medica', name: 'Clínica Médica', category: 'servicos', tag: 'Saúde', emoji: '⚕️', color: '#0891b2' },
    { slug: 'odontologia', name: 'Odontologia', category: 'servicos', tag: 'Saúde bucal', emoji: '🦷', color: '#06b6d4' },
    { slug: 'estetica', name: 'Estética & Beleza', category: 'servicos', tag: 'Beleza', emoji: '💄', color: '#ec4899' },
    { slug: 'eletricista', name: 'Eletricista', category: 'servicos', tag: 'Reparos', emoji: '⚡', color: '#eab308' },
    { slug: 'encanador', name: 'Encanador', category: 'servicos', tag: 'Reparos', emoji: '🔧', color: '#2563eb' },
    { slug: 'mecanica', name: 'Mecânica / Auto Center', category: 'servicos', tag: 'Automotivo', emoji: '🔩', color: '#dc2626' },
    { slug: 'assistencia-tecnica', name: 'Assistência Técnica', category: 'servicos', tag: 'Tech', emoji: '🛠️', color: '#0ea5e9' },
    { slug: 'agencia-marketing', name: 'Agência de Marketing', category: 'servicos', tag: 'Serviços criativos', emoji: '📊', color: '#a855f7' },
    { slug: 'limpeza', name: 'Limpeza', category: 'servicos', tag: 'Doméstico / corporativo', emoji: '🧹', color: '#10b981' },
    { slug: 'imobiliaria', name: 'Imobiliária', category: 'servicos', tag: 'Venda / aluguel', emoji: '🏘️', color: '#0891b2' },
    { slug: 'loja', name: 'Loja / Catálogo', category: 'comercio', tag: 'Varejo', emoji: '🛍️', color: '#f97316' },
    { slug: 'restaurante', name: 'Restaurante', category: 'comercio', tag: 'Gastronomia', emoji: '🍽️', color: '#dc2626' },
    { slug: 'pizzaria', name: 'Pizzaria', category: 'comercio', tag: 'Gastronomia', emoji: '🍕', color: '#ea580c' },
    { slug: 'padaria', name: 'Padaria', category: 'comercio', tag: 'Padaria / confeitaria', emoji: '🥖', color: '#a16207' },
    { slug: 'academia', name: 'Academia', category: 'comercio', tag: 'Fitness', emoji: '💪', color: '#16a34a' },
    { slug: 'pet-shop', name: 'Pet Shop', category: 'comercio', tag: 'Animais', emoji: '🐾', color: '#f59e0b' },
    { slug: 'fotografo', name: 'Fotógrafo', category: 'comercio', tag: 'Portfolio', emoji: '📸', color: '#1e293b' },
    { slug: 'advogado', name: 'Advogado Autônomo', category: 'profissionais', tag: 'Jurídico', emoji: '👨‍⚖️', color: '#581c87' },
    { slug: 'contador', name: 'Contador', category: 'profissionais', tag: 'Contábil', emoji: '📒', color: '#1d4ed8' },
    { slug: 'corretor', name: 'Corretor de Imóveis', category: 'profissionais', tag: 'Imobiliário', emoji: '🔑', color: '#0891b2' },
    { slug: 'personal-trainer', name: 'Personal Trainer', category: 'profissionais', tag: 'Fitness', emoji: '🏋️', color: '#16a34a' },
    { slug: 'consultor', name: 'Consultor / Autônomo', category: 'profissionais', tag: 'Consultoria', emoji: '🎯', color: '#7c3aed' },
  ];

  const filtered = templates
    .filter((t) => filter === 'all' || t.category === filter)
    .filter((t) => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.tag.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="px-8 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-fg mb-1">Modelos</h1>
        <p className="text-fg-muted">{templates.length} templates com identidade própria em 4 categorias.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex gap-1 bg-bg-elev rounded-lg p-1 border border-border">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filter === c.id ? 'bg-bg-elev2 text-fg' : 'text-fg-muted hover:text-fg'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex-1 max-w-md">
          <Input
            type="text"
            placeholder="Buscar modelo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((t) => (
          <ModelCard key={t.slug} template={t} />
        ))}
      </div>
    </div>
  );
}

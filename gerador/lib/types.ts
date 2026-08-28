export interface ProjectRecord {
  id: string;
  owner_id: string;
  client_id: string | null;
  name: string;
  template_id: string;
  status: 'draft' | 'generating' | 'ready' | 'failed';
  schema: any | null;
  theme: any | null;
  assets: any | null;
  generation_log: any[] | null;
  error_message: string | null;
  zip_path: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientRecord {
  id: string;
  owner_id: string;
  name: string;
  segment: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  state: string | null;
  notes: string | null;
  created_at: string;
}

export interface ProjectVersionRecord {
  id: string;
  project_id: string;
  label: string;
  schema: any;
  theme: any;
  assets: any;
  created_at: string;
}

export interface AssetRecord {
  id: string;
  owner_id: string;
  project_id: string | null;
  name: string;
  url: string;
  origin: 'upload' | 'external' | 'reference';
  mime: string;
  alt: string | null;
  created_at: string;
}

export interface ReferenceRecord {
  id: string;
  owner_id: string;
  url: string;
  type: 'site' | 'instagram' | 'visual';
  title: string | null;
  palette: string[] | null;
  created_at: string;
}

export interface TemplateRecord {
  id: string;
  slug: string;
  name: string;
  category: 'institucional' | 'servicos' | 'comercio' | 'profissionais';
  segment: string;
  description: string;
  default_theme: any;
  pages: any[];
  presets: any | null;
  created_at: string;
}

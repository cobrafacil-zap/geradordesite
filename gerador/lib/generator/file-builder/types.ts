import type { Site, Asset, Theme } from '../site-schema';

export type DbAdapter = 'sqlite' | 'postgres';

export interface BuildOptions {
  projectName: string;
  site: Site;
  assets: Asset[];
  dbAdapter: DbAdapter;
  /** Modelo/segmento do projeto — usado para copy de boas-vindas */
  templateName?: string;
  /** Theme a ser aplicado ao projeto exportado. Default = site.theme */
  theme?: Theme;
}

export type FileMap = Record<string, string>;

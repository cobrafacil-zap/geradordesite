/**
 * Constrói o ZIP real do projeto exportado a partir do FileMap.
 * Usa JSZip — server-side, em memória.
 */
import JSZip from 'jszip';
import type { FileMap } from './file-builder/types';

export interface ZipOptions {
  /** Pasta raiz do ZIP (ex: slug do projeto). Default: 'site'. */
  root?: string;
}

export async function buildZip(files: FileMap, options: ZipOptions = {}): Promise<Blob> {
  const zip = new JSZip();
  const root = options.root || 'site';

  for (const [path, content] of Object.entries(files)) {
    zip.file(`${root}/${path}`, content);
  }

  const buffer = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  return buffer;
}

export async function buildZipBuffer(files: FileMap, options: ZipOptions = {}): Promise<Buffer> {
  const zip = new JSZip();
  const root = options.root || 'site';

  for (const [path, content] of Object.entries(files)) {
    zip.file(`${root}/${path}`, content);
  }

  return await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}
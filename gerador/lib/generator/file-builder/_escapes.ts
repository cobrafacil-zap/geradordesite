/**
 * Helpers para escapar conteúdo gerado.
 * Importante: template literals com ${} não podem conter código TS que
 * pareça interpolação — usamos `ts` para fazer substituição segura.
 */

export function ts(parts: TemplateStringsArray, ...values: any[]): string {
  let out = '';
  parts.forEach((p, i) => {
    out += p;
    if (i < values.length) out += String(values[i] ?? '');
  });
  return out;
}
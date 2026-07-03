// Calcula overrides de métricas (estilo fontaine) para fallbacks locales,
// eliminando el layout shift del font-swap. Uso: node scripts/fallback-metrics.mjs
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';

const root = path.dirname(fileURLToPath(import.meta.url));

const SAMPLE = 'abcdefghijklmnopqrstuvwxyz ';

function avgWidth(font) {
  let total = 0;
  for (const ch of SAMPLE) {
    const glyph = font.charToGlyph(ch);
    total += (glyph.advanceWidth ?? font.unitsPerEm * 0.5) / font.unitsPerEm;
  }
  return total / SAMPLE.length;
}

function metrics(font) {
  const upm = font.unitsPerEm;
  const hhea = font.tables.hhea;
  return {
    ascent: hhea.ascender / upm,
    descent: Math.abs(hhea.descender) / upm,
    lineGap: (hhea.lineGap ?? 0) / upm,
    avg: avgWidth(font),
  };
}

function overrides(webFont, fallbackFont) {
  const w = metrics(webFont);
  const f = metrics(fallbackFont);
  const sizeAdjust = w.avg / f.avg;
  return {
    sizeAdjust: (sizeAdjust * 100).toFixed(2) + '%',
    ascent: ((w.ascent / sizeAdjust) * 100).toFixed(2) + '%',
    descent: ((w.descent / sizeAdjust) * 100).toFixed(2) + '%',
    lineGap: ((w.lineGap / sizeAdjust) * 100).toFixed(2) + '%',
  };
}

const fraunces = opentype.loadSync(path.join(root, 'fonts/fraunces-600.ttf'));
const hanken = opentype.loadSync(path.join(root, 'fonts/hanken-500.ttf'));
const georgia = opentype.loadSync('C:/Windows/Fonts/georgia.ttf');
const arial = opentype.loadSync('C:/Windows/Fonts/arial.ttf');

console.log('Fraunces -> Georgia:', JSON.stringify(overrides(fraunces, georgia), null, 2));
console.log('Hanken -> Arial:', JSON.stringify(overrides(hanken, arial), null, 2));

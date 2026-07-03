// Genera: 1) src/assets/app-screen.jpg (screenshot recortado, sin chrome del
// navegador) y 2) public/og.jpg 1200×630 (navy + gradiente violeta + H1 corto
// + mockup), con el texto convertido a paths para no depender de fuentes del
// sistema. Ejecutar: npm run og
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import opentype from 'opentype.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const project = path.join(root, '..');

const RAW = path.join(project, 'src/assets/app-screen-raw.jpeg');
const CROPPED = path.join(project, 'src/assets/app-screen.jpg');
const OG = path.join(project, 'public/og.jpg');

// ---------- 1. Recorte del screenshot (quita status bar + barra del browser) ----------
const CROP_TOP = 145;
const meta = await sharp(RAW).metadata();
await sharp(RAW)
  .extract({ left: 0, top: CROP_TOP, width: meta.width, height: meta.height - CROP_TOP })
  .jpeg({ quality: 88 })
  .toFile(CROPPED);
console.log(`app-screen.jpg: ${meta.width}×${meta.height - CROP_TOP}`);

// ---------- 2. OG image ----------
const fraunces = opentype.loadSync(path.join(root, 'fonts/fraunces-600.ttf'));
const hanken = opentype.loadSync(path.join(root, 'fonts/hanken-500.ttf'));

const textPath = (font, text, x, y, size, opts = {}) =>
  font.getPath(text, x, y, size, { kerning: true, ...opts }).toPathData(2);

const CREAM = '#FCF8F2';
const NAVY = '#091B31';
const VIOLET = '#C784D2';
const VIOLET_LIGHT = '#A292F9';

const h1Lines = ['Quando a próxima crise', 'chegar, você vai saber', 'o que fazer.'];
const h1Size = 62;
const h1X = 80;
let h1Y = 250;

let h1Paths = '';
for (const line of h1Lines) {
  h1Paths += `<path d="${textPath(fraunces, line, h1X, h1Y, h1Size)}" fill="${CREAM}"/>`;
  h1Y += h1Size * 1.22;
}

const eyebrow = textPath(hanken, 'S O S  A N S I E D A D E', h1X, 160, 26);
const sub = textPath(
  hanken,
  'Protocolo de 3 passos · Respiração → Grounding → Borboleta',
  h1X,
  520,
  25
);

// Teléfono: screenshot 270px de ancho, esquinas redondeadas, a la derecha
const phoneW = 250;
const phoneX = 880;
const phoneY = 64;
const shot = await sharp(CROPPED).resize({ width: phoneW }).toBuffer();
const shotMeta = await sharp(shot).metadata();
const phoneH = Math.min(shotMeta.height, 630 - phoneY + 80); // se corta abajo, ok
const rounded = await sharp(shot)
  .composite([
    {
      input: Buffer.from(
        `<svg width="${phoneW}" height="${shotMeta.height}"><rect width="${phoneW}" height="${shotMeta.height}" rx="30" fill="#fff"/></svg>`
      ),
      blend: 'dest-in',
    },
  ])
  .png()
  .toBuffer();

const baseSvg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="70%" cy="18%" r="75%">
      <stop offset="0%" stop-color="${VIOLET_LIGHT}" stop-opacity="0.4"/>
      <stop offset="45%" stop-color="${VIOLET}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${NAVY}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="${NAVY}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="${phoneX - 10}" y="${phoneY - 10}" width="${phoneW + 20}" height="700" rx="40" fill="#0F2440"/>
  <path d="${eyebrow}" fill="${VIOLET_LIGHT}"/>
  ${h1Paths}
  <path d="${sub}" fill="#AEB9C9"/>
</svg>`;

await sharp(Buffer.from(baseSvg))
  .composite([{ input: rounded, left: phoneX, top: phoneY }])
  .flatten({ background: NAVY })
  .jpeg({ quality: 88 })
  .toFile(OG);

const ogMeta = await sharp(OG).metadata();
console.log(`og.jpg: ${ogMeta.width}×${ogMeta.height}, ${Math.round(fs.statSync(OG).size / 1024)} KB`);

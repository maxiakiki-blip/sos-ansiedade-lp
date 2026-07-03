// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  build: {
    // CSS inline: elimina el request render-blocking (budget LCP < 2.0s)
    inlineStylesheets: 'always',
  },
  site: 'https://sos-ansiedade-lp.vercel.app', // TODO: reemplazar cuando haya dominio propio
  vite: {
    plugins: [tailwindcss()],
  },
});

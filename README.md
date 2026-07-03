# Página de ventas — SOS Ansiedade

Landing de conversión para Hotmart. Astro 5 + Tailwind 4, estática, lista para Vercel.

## Comandos

```bash
npm install        # una sola vez
npm run dev        # ver en http://localhost:4321
npm run build      # genera dist/ para deploy
npm run og         # regenera public/og.jpg y el screenshot recortado
```

## Deploy en Vercel

Importar esta carpeta como proyecto en Vercel: detecta Astro solo. Sin variables de entorno.

## Datos pendientes (buscar "TODO(Maxi)" en el código)

| Dato | Dónde va |
|---|---|
| ID del pixel de Meta (crear uno NUEVO) | `src/consts.ts` → `META_PIXEL_ID` |
| Valor exacto de la cuota 12x (del checkout) | `src/components/Oferta.astro` |
| Historia personal (120–180 palabras) | `src/components/Historia.astro` + activar en `src/pages/index.astro` |
| Testimonios reales (3–6) | `src/components/Prova.astro` + activar en `src/pages/index.astro` |
| Duración real de cada paso del protocolo | `src/components/Protocolo.astro` y FAQ |
| ¿El app funciona offline? | `src/components/AppAcao.astro` (solo afirmar si es real) |
| Timing del widget de respiración (hoy 4s/2s/6s) | `src/components/Breathing.astro` |
| Links de Términos y Privacidad | `src/components/Footer.astro` |
| Dominio final | `astro.config.mjs` → `site` |

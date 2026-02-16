# Basílica San Vicente Ferrer Web (Next.js + TS + Tailwind)

## Ejecutar local
```bash
npm install
npm run dev
```

## Build producción
```bash
npm run build && npm run start
```

## Deploy
- **Vercel**: importar repo y desplegar.
- **Netlify**: usar adapter Next.js o deploy de `next build`.

## Editar contenidos
Editar archivos en `src/data/*.json`:
- announcements.json
- songs.json
- prayers.json
- saints.json
- events.json

## API
- `GET /api/saint-of-day`: scraping robusto con fallback cache/manual.

## Tests
```bash
npm run test
```

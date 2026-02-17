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


## Nuevas APIs litúrgicas (implementadas)

### `GET /api/santo-hoy`
Ejemplo:
`/api/santo-hoy?date=2026-06-29&locale=es-AR&diocese=mendoza`

Respuesta:
- `date`, `saint`, `celebration`, `rank`, `color`, `season`
- `image_url` (si existe en catálogo)
- `image_included` boolean

### `GET /api/calendario-liturgico`
Ejemplo:
`/api/calendario-liturgico?year=2026&country=AR&diocese=mendoza`

Respuesta:
- `year`, `country`, `diocese`, `total`, `items[]` ordenado por fecha.

Datos de base:
- `src/data/liturgical_overrides_2026_mendoza.json`
- `src/data/saint_images.json`

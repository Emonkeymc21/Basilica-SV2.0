# Basílica SV — Upgrade Premium (Starter + Arquitectura)

Este paquete extiende el proyecto existente con una base profesional para evolucionar a una web institucional católica con panel administrativo, formularios y modelo de datos escalable.

## Qué se agregó
- Documentación de arquitectura y UX/UI: `docs/ARQUITECTURA_PREMIUM_IGLESIA_CATOLICA.md`
- Prisma schema ampliado: `prisma/schema.prisma`
- SQL inicial crítico: `sql/initial_critical_tables.sql`
- Starter UI premium home / admin dashboard
- API de ejemplo: contacto y oración
- Helpers de seguridad y validación
- SEO técnico básico (`robots.ts`, `sitemap.ts`, schema helpers)

## Instalación (sugerida)
1. `npm install`
2. Completar `.env` desde `.env.example`
3. `npx prisma generate`
4. `npx prisma migrate dev`
5. `npm run dev`

## Dependencias recomendadas a agregar
- `prisma`, `@prisma/client`
- `zod`
- `@auth/core` / `next-auth` (Auth.js)
- `bcryptjs` o `argon2`
- `resend`
- `@upstash/ratelimit` + `@upstash/redis` (opcional prod)
- `framer-motion`
- `sanitize-html` o `isomorphic-dompurify`

## MVP en 2 semanas (realista)
- Home + Horarios + Sacramentos + Contacto + Oración + Noticias/Eventos read-only
- Panel admin básico para horarios/eventos/noticias
- Auth con 1 admin
- Deploy Vercel + Postgres + Resend

## Versión completa en 6–8 semanas
- CMS/panel avanzado, programación de publicaciones, galería, roles finos
- Moderación completa de formularios
- Multisede, ministerios, donaciones, livestreams, analytics, monitoreo, QA ampliado

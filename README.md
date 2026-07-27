# satelite.ar — Portal de datos satelitales (Argentina)

Portal de curación de contenido satelital con integración NASA API, foco en Argentina.
Trabajo práctico final de Técnicas Avanzadas de Programación (UMET).

**Stack:** Next.js 14 (App Router) + Nest.js + Prisma + PostgreSQL + Turborepo

**Características:**
- SSR/SSG con Next.js App Router, deploy en Vercel
- API RESTful con Nest.js y Swagger/OpenAPI
- CRUD de Posts y Tags con estados draft/published
- Proxy seguro a NASA APIs (APOD, EONET, GIBS, SMAP)
- Panel admin con autenticación por token
- Monorepo con Turborepo

**Arquitectura:**
- `apps/web/` — Next.js (frontend + SSR)
- `apps/api/` — Nest.js (backend + API REST + proxy NASA)

---

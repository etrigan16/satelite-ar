# satelite.ar — Portal de curación de datos satelitales (Argentina)

> Portal de curación de contenido especializado en datos satelitales (integración NASA) y análisis públicos con foco en Argentina. Arquitectura desacoplada basada en MVC y microservicios.
>
> Trabajo Práctico Final de la materia **Técnicas Avanzadas de la Programación** de la **Universidad Metropolitana para la Educación y el Trabajo (UMET)**.

<!--
Este bloque inicial ofrece una visión general, requisitos, instalación y buenas prácticas.
Mantiene el README como punto de entrada educativo para desarrolladores junior/SSR.
-->

## Visión general
- Monorepo con Turborepo (frontend y backend desacoplados).
- Frontend: Next.js (App Router) con SSR/SSG, desplegado en Vercel.
- Backend: Nest.js como funciones serverless en Vercel.
- ORM/DB: Prisma + Vercel Postgres (Docker/PostgreSQL y Redis en local).
- Modelo central: `Post` (estados: `draft`, `published`) con relación many-to-many a `Tag`.
- API RESTful con CRUD para Posts y Tags, documentación con Swagger/OpenAPI.
- Integraciones externas a través de un `NasaProxy` seguro.

## Estructura del Monorepo
- `apps/web`: Frontend (Next.js App Router).
  - Rutas públicas: `apps/web/app/*`.
  - Panel admin y proxies internos: `apps/web/app/admin/*`.
  - Cliente de API y tipos: `apps/web/lib/api.ts`, `apps/web/lib/types.ts`.
  - UI local estilo shadcn: `apps/web/components/ui/*`.
- `apps/api`: Backend (Nest.js + Prisma).
  - Controladores/servicios (MVC): `apps/api/src/**`.
  - Módulos del dominio: `posts`, `tags`, `nasa`.
  - Prisma y migraciones: `apps/api/prisma/*`.

## Arquitectura MVC y CRUD
- MVC (Nest.js):
  - Controladores: `apps/api/src/posts/posts.controller.ts`, `apps/api/src/tags/tags.controller.ts`, `apps/api/src/nasa/nasa.controller.ts`.
  - Servicios: `apps/api/src/posts/posts.service.ts`, `apps/api/src/tags/tags.service.ts`, `apps/api/src/nasa/nasa.service.ts`.
  - Módulos: `apps/api/src/posts/posts.module.ts`, `apps/api/src/tags/tags.module.ts`, `apps/api/src/nasa/nasa.module.ts`.
- CRUD:
  - Posts: `GET/POST/PATCH/DELETE` implementados en `posts.controller.ts` y `posts.service.ts`.
  - Tags: `GET/POST/PATCH/DELETE` en `tags.controller.ts` y `tags.service.ts`.
  - DTOs y validaciones: `apps/api/src/posts/dto/*`, `apps/api/src/tags/dto/*`.

## Integración NASA (NasaProxy)
- Backend:
  - Módulo `nasa`: `apps/api/src/nasa/*` con controlador y servicio que consumen las APIs públicas de NASA usando `NASA_API_KEY` desde entorno.
  - Seguridad: `AdminGuard` (`apps/api/src/common/guards/admin.guard.ts`) valida `x-admin-token` para mutaciones/admin.
- Frontend:
  - Proxy interno admin: rutas `apps/web/app/admin/api/nasa/apod/route.ts` que inyectan `x-admin-token` desde servidor.
  - Cliente: `apps/web/lib/api.ts` expone `fetchNasaApod()` (proxy admin) y `fetchNasaApodPublic()` (rewrite público).
- Flujo y resultado:
  - El frontend solicita APOD vía proxy admin → el backend `nasa.service.ts` consulta a NASA → se retornan datos curados (título, explicación, fecha, url/hdurl).
  - Los datos pueden ser usados para enriquecer un `Post` y almacenados en la BD (Prisma) junto con `tags` para exposición pública controlada.
  - Objetivo: aceptar peticiones de usuarios sobre datos "curados" (filtrados/validados) desde la sección pública.

## Requisitos previos
- `Node.js >= 18`
- `Yarn >= 1.22` (gestor de paquetes recomendado)
- `Docker` (para desarrollo local de DB/Redis)
- `Vercel CLI` (opcional, para simular entorno serverless)

## Instalación rápida

```bash
# 1) Instalar dependencias
yarn install

# 2) Configurar variables de entorno (ver sección siguiente)
# Crear archivo .env en la raíz y/o en apps según corresponda

# 3) (Opcional) Levantar servicios locales con Docker
# docker compose up -d

# 4) Ejecutar en desarrollo (cuando se definan los scripts en cada app)
# Frontend
# yarn workspace @satelite/frontend dev
# Backend
# yarn workspace @satelite/backend start:dev
```

## Variables de entorno
Configura las claves y URLs en archivos `.env` (no subirlas al repo):

```bash
# Ejemplo .env (raíz o específico de cada app)
DATABASE_URL="postgresql://user:password@localhost:5432/satelite_db"
NASA_API_KEY="<tu_clave_de_nasa_aqui>"
# (Opcional) REDIS_URL, VERCEL_POSTGRES_URL, etc.
```

- Nunca commitees `DATABASE_URL` ni `NASA_API_KEY`.
- En Vercel, usa `Project Settings > Environment Variables` para gestionar secretos.
- En local, puedes usar `.env` y herramientas como `dotenv`.

## Datos y API
- Contrato de datos (`Prisma`): `apps/api/prisma/schema.prisma` con `Post`, `Tag` y relación many-to-many; estados `draft`/`published`.
- CRUD REST:
  - Endpoints en `apps/api/src/posts/*.ts` y `apps/api/src/tags/*.ts`.
  - Filtros y búsqueda implementados en `posts.service.ts`.
- Integraciones externas (NasaProxy):
  - `apps/api/src/nasa/*` consume NASA y retorna datos curados.
  - `apps/web/app/admin/api/nasa/*` actúa como proxy interno seguro.
- Dónde buscar:
  - Tipos y cliente frontend: `apps/web/lib/types.ts`, `apps/web/lib/api.ts`.
  - UI y formularios admin: `apps/web/components/admin/*`, `apps/web/app/admin/*`.
  - Guardas y seguridad: `apps/api/src/common/guards/admin.guard.ts`.

<!--
A medida que se definan los endpoints, añadir ejemplos de requests/responses y
enlaces a la documentación generada por Swagger.
-->

## Tests
- Pruebas unitarias con Jest para lógica crítica (Posts, Tags, NasaProxy).

```bash
# Ejecutar tests (cuando se definan en cada paquete)
yarn test
# o por workspace
# yarn workspace @satelite/backend test
# yarn workspace @satelite/frontend test
```

## Buenas prácticas de seguridad
- Usar `env` y secretos gestionados (no subir claves).
- Validar inputs en controladores y servicios (sanitización y esquemas DTO).
- Limitar exposición de endpoints y aplicar rate-limiting si es necesario.
- CORS y headers seguros en frontend/backend.
- Logs controlados sin datos sensibles.

## Próximos pasos
1. Completar documentación Swagger/OpenAPI del CRUD y publicar ejemplos.
2. Desplegar monorepo en Vercel (Web y API con dominios `satelite.ar` y `api.satelite.ar`).
3. Conectar otras APIs de NASA:
   - **EONET** (desastres naturales): ingesta y curación de eventos, exposición de endpoints públicos.
   - **GIBS** (imágenes satelitales casi en tiempo real): integración para previsualización y almacenamiento de metadatos relevantes.
   - **SMAP** (humedad de suelo): obtención periódica y agregación en BD para consultas históricas/regionales.
4. Añadir autenticación (NextAuth.js) para el panel y mutaciones.
5. Tests E2E (Playwright) sobre flujos admin y público.

## Referencias
- Next.js (App Router): https://nextjs.org/docs/app
- Nest.js: https://docs.nestjs.com/
- Prisma: https://www.prisma.io/docs
- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Turborepo: https://turbo.build/repo/docs
- Docker: https://docs.docker.com/
- Jest: https://jestjs.io/docs/getting-started
- Swagger/OpenAPI: https://swagger.io/docs/
- NASA APIs: https://api.nasa.gov/

---

## Nota para evaluación académica (UMET)
- Este repositorio implementa un portal tipo blog/portal con curación de datos satelitales.
- Arquitectura basada en **MVC desacoplado** y microservicios (Next.js + Nest.js).
- Ubicación y búsqueda rápida:
  - MVC backend: `apps/api/src/{posts,tags,nasa}/*`.
  - CRUD: controladores/servicios y DTOs en los módulos anteriores.
  - Integración NASA: `apps/api/src/nasa/*` y proxy admin en `apps/web/app/admin/api/nasa/*`.
  - Datos y contratos: `apps/api/prisma/schema.prisma` y migraciones en `apps/api/prisma/migrations/*`.
  - Frontend SSR/SSG y panel admin: `apps/web/app/*` y componentes en `apps/web/components/*`.


<!--
Mantén este README actualizado conforme avances: añadir endpoints, scripts y
flujos de despliegue. Es el principal recurso para onboarding del equipo.
-->
## Configuración de credenciales de administración (Quick Protection)

Este proyecto incluye una protección rápida para el panel de administración y las operaciones de creación/edición de posts/tags. Las credenciales y tokens se definen mediante variables de entorno.

- Frontend (`apps/web/.env.local`):
  - `ADMIN_UI_USER`: usuario de login admin (solo servidor)
  - `ADMIN_UI_PASS`: contraseña de login admin (solo servidor)
  - `ADMIN_UI_SESSION_TOKEN`: token de sesión estático para la cookie `admin_session`
  - `ADMIN_API_TOKEN`: token compartido para mutaciones admin (debe coincidir con backend)
  - `API_BASE_URL`: URL del backend (por defecto `http://localhost:3001`)

- Backend (`apps/api/.env`):
  - `ADMIN_API_TOKEN`: token compartido para validar el header `x-admin-token`

Ejemplo rápido (copiar desde `.env.example`):

```ini
# apps/web/.env.local
ADMIN_UI_USER=admin
ADMIN_UI_PASS=changeme-LocalOnly!
ADMIN_UI_SESSION_TOKEN=3b0f0f09b36c4f5d8c3e1b7a8a6e4c12
ADMIN_API_TOKEN=local-api-token-123
API_BASE_URL=http://localhost:3001

# apps/api/.env
ADMIN_API_TOKEN=local-api-token-123
```

Generar tokens seguros:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Buenas prácticas de seguridad:
- No exponer secretos con `NEXT_PUBLIC_*`.
- No commitear `.env` ni `.env.local`.
- En producción, configurar cookies como `httpOnly`, `secure`, `sameSite=strict` y limitar el `Domain`.
- Agregar rate limiting al login y rotación de tokens.

## Ejecución en desarrollo

- Backend (Nest, puerto `3001`):

```bash
cd apps/api
yarn install
$env:PORT=3001; yarn start:dev
```

- Frontend (Next, puerto `3000`):

```bash
cd apps/web
yarn install
yarn dev
```

Flujo de acceso admin:
- Abre `http://localhost:3000/admin` → si no hay sesión, redirige a `/admin/login`.
- Login con `ADMIN_UI_USER`/`ADMIN_UI_PASS` → se setea la cookie `admin_session`.
- Crear/editar posts/tags → el proxy interno inyecta `x-admin-token` y el backend lo valida con `AdminGuard`.

## Notas
- Arquitectura MVC desacoplada, SSR/SSG en Next.js, Nest.js en funciones serverless.
- Prisma con Postgres (Vercel Postgres); Redis en Docker para local.
- Mantener contratos de API y migraciones alineados (Swagger/OpenAPI y `schema.prisma`).

## Despliegue en Vercel

Monorepo con dos proyectos: `Web (Next.js)` y `API (Nest.js)`.

- Organización de proyectos:
  - Web
    - Root Directory: `apps/web`
    - Framework Preset: `Next.js`
    - Install Command: `yarn install`
    - Build Command: `yarn build`
    - Env (Production/Preview):
      - `API_BASE_URL=https://api.satelite.ar`
      - `ADMIN_UI_USER`
      - `ADMIN_UI_PASS`
      - `ADMIN_UI_SESSION_TOKEN`
      - `ADMIN_API_TOKEN` (debe coincidir con API)
  - API
    - Root Directory: `apps/api`
    - Framework Preset: `Node.js` (Serverless Functions)
    - Install Command: `yarn install`
    - Build Command: `yarn build`
    - Env (Production/Preview):
      - `ADMIN_API_TOKEN`
      - `DATABASE_URL` (Vercel Postgres)
      - `NASA_API_KEY`
    - Migraciones (opcional recomendado): agregar script de build o postdeploy que ejecute `yarn prisma migrate deploy`.

- Dominios y rutas:
  - Web: `satelite.ar`
  - API: `api.satelite.ar`
  - Configurar `API_BASE_URL` del Web apuntando al dominio del API.

- Pasos recomendados:
  - Crear/Linkear el repositorio en Vercel.
  - Crear dos proyectos dentro del mismo equipo: uno para `apps/web` y otro para `apps/api` (Root Directory en cada caso).
  - Cargar variables de entorno en Vercel para `Development`, `Preview` y `Production`.
  - Verificar logs de build y de funciones tras el primer deploy.

- Seguridad en producción:
  - Cookies admin: `httpOnly`, `secure`, `sameSite=strict`, `Domain=satelite.ar`.
  - No exponer secretos como `NEXT_PUBLIC_*`.
  - Rotación de `ADMIN_API_TOKEN` y `ADMIN_UI_SESSION_TOKEN`.
  - Rate limiting en login y en endpoints de mutación.

- Validación post-deploy:
  - Web: visitar `/admin` y validar login/redirecciones.
  - API: probar `GET /tags`, `POST /posts` vía proxy del Web.
  - Revisar que los Tags se carguen en `/admin/posts/new`.

Referencias:
- Next.js en Vercel: https://vercel.com/docs/frameworks/nextjs
- Monorepos en Vercel: https://vercel.com/docs/monorepos
- Funciones Serverless (Node): https://vercel.com/docs/functions/serverless-functions
- Prisma Deploy Migrations: https://www.prisma.io/docs/orm/prisma-migrate/deploying-migrations

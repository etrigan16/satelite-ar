# satelite.ar — Portal de curación de datos satelitales (Argentina)

> Portal de curación de contenido especializado en datos satelitales (integración NASA) y análisis públicos con foco en Argentina. Arquitectura desacoplada basada en MVC y microservicios.

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
- `schema.prisma` define el contrato de datos: `Post` y `Tag` con relación many-to-many y estados `draft`/`published`.
- CRUD REST para Posts/Tags (crear, listar, obtener, actualizar, borrar).
- Documentación del backend con Swagger/OpenAPI.
- Todas las integraciones externas (NASA API) pasan por el backend (`NasaProxy`).

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

## Próximos pasos sugeridos
1. Crear `schema.prisma` con modelos `Post`, `Tag` y relación many-to-many.
2. Generar migración inicial y bootstrap de Prisma.
3. Inicializar backend Nest.js con CRUD y documentación Swagger.
4. Montar frontend Next.js (App Router) con páginas de listado/detalle/edición.
5. Configurar Docker (PostgreSQL/Redis) y Vercel CLI para entorno local.
6. Añadir tests unitarios con Jest.

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

<!--
Mantén este README actualizado conforme avances: añadir endpoints, scripts y
flujos de despliegue. Es el principal recurso para onboarding del equipo.
-->
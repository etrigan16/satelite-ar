# API del portal satelite.ar

> Trabajo Práctico Final de **Técnicas Avanzadas de la Programación** — **Universidad Metropolitana para la Educación y el Trabajo (UMET)**.
> Backend del portal de curación de datos satelitales con arquitectura **MVC** y microservicios.

- Backend del portal de curación de contenido y análisis de datos satelitales para Argentina.
- Arquitectura: MVC desacoplado y microservicios (este servicio es el API).
- Stack: Nest.js, Prisma (PostgreSQL), Vercel Serverless Functions.
- Monorepo: Turborepo. Frontend en `apps/web` (Next.js App Router).

## Descripción

Servicio API (Nest.js) del portal satelite.ar. Usa Prisma (PostgreSQL) para el modelo de datos `Post` y `Tag` con relación muchos-a-muchos y estados `draft`/`published`.

Este README explica cómo configurar entorno local, base de datos con Docker y comandos de Prisma usando Yarn.

## Dónde buscar (MVC y CRUD)
- Controladores (C):
  - `apps/api/src/posts/posts.controller.ts`
  - `apps/api/src/tags/tags.controller.ts`
  - `apps/api/src/nasa/nasa.controller.ts`
- Servicios (S):
  - `apps/api/src/posts/posts.service.ts`
  - `apps/api/src/tags/tags.service.ts`
  - `apps/api/src/nasa/nasa.service.ts`
- Módulos (M):
  - `apps/api/src/posts/posts.module.ts`
  - `apps/api/src/tags/tags.module.ts`
  - `apps/api/src/nasa/nasa.module.ts`
- DTOs y validación:
  - `apps/api/src/posts/dto/*`
  - `apps/api/src/tags/dto/*`
- Prisma y migraciones:
  - `apps/api/prisma/schema.prisma`
  - `apps/api/prisma/migrations/*`

## Setup del proyecto

- Instalación de dependencias (monorepo root):
```bash
yarn install
```

- Variables de entorno (workspace API):
  - Archivo: `apps/api/.env` (creado automáticamente, ignorado por Git)
  - Ejemplo:
    ```bash
    DATABASE_URL="postgresql://admin:password123@127.0.0.1:5433/satelite_ar_db"
    SHADOW_DATABASE_URL="postgresql://admin:password123@127.0.0.1:5433/satelite_ar_db_shadow"
    # NASA_API_KEY="<tu_api_key>"
    ```
  - Seguridad: nunca commitees `.env`. Ya está en `.gitignore`.

## Compilar y levantar el servicio

```bash
# desarrollo (desde apps/api)
yarn start

# watch mode
yarn start:dev

# producción
yarn start:prod
```

> Recomendado ejecutar desde el root usando workspace:
```bash
yarn workspace @satelite/api start:dev
```

## Tests

```bash
# unit tests
yarn test

# e2e tests
yarn test:e2e

# cobertura
yarn test:cov
```

> Sugerencia: mockea Prisma Client en servicios para tests unitarios.

## Base de datos local con Docker

- Archivo: `docker-compose.yml` en el root del monorepo.
- Servicios: `db` (Postgres en puerto 5433 del host) y `cache` (Redis).
- Comandos:
```bash
# levantar solo Postgres
docker compose up -d db

# ver estado
docker compose ps
```

## Prisma (ORM)

- Generar cliente:
```bash
yarn workspace @satelite/api prisma generate
```

- Migraciones (crea y aplica cambios del schema):
```bash
yarn workspace @satelite/api prisma migrate dev --name init_posts_and_tags
```

- Sincronizar schema sin migración (solo desarrollo):
```bash
yarn workspace @satelite/api prisma db push
```

- Studio (inspección de datos):
```bash
yarn workspace @satelite/api prisma studio
```

### Troubleshooting

- Error `P1010: User was denied access`:
  - Asegúrate de que el contenedor `db` está en `healthy` y escuchando en `127.0.0.1:5433`.
  - Verifica que `apps/api/.env` tiene las URLs correctas.
  - Si usas Postgres local en 5432, mantén Docker publicado en 5433 para evitar conflictos.
  - Usa `SHADOW_DATABASE_URL` para Prisma Migrate (ya configurado) y asegúrate de que la DB sombra exista.

## Modelo de Datos

- Ubicación del schema: `apps/api/prisma/schema.prisma`
- Entidades: `Post`, `Tag`, `Status` (enum `draft|published`)
- Operaciones CRUD expuestas por el servicio (pendiente de endpoints REST + Swagger).

## Contrato REST (API)

- Recursos principales:
  - `Post` (artículo): tiene `title`, `content`, `status` (`draft|published`), relación muchos-a-muchos con `Tag`.
  - `Tag`: etiqueta temática para clasificar artículos.

- Endpoints (propuesta inicial):
  - `GET /posts`
    - Lista posts, admite filtros opcionales: `status`, `tagIds`, `search`.
    - Ejemplo: `/posts?status=published&tagIds=1,2&search=nasa`
  - `GET /posts/:id`
    - Obtiene un post por `id`.
  - `POST /posts`
    - Crea un post.
    - Request (JSON):
      ```json
      {
        "title": "Análisis de imágenes Landsat en Argentina",
        "content": "Resumen técnico y dataset utilizados...",
        "status": "draft",
        "tagIds": [1, 2]
      }
      ```
    - Responses: `201 Created` con el recurso creado; `400 Bad Request` si el payload es inválido.
  - `PATCH /posts/:id`
    - Actualiza campos del post (parcial).
    - Request (JSON):
      ```json
      {
        "status": "published",
        "title": "Landsat: análisis actualizado",
        "tagIds": [2, 3]
      }
      ```
    - Responses: `200 OK`; `404 Not Found` si no existe.
  - `DELETE /posts/:id`
    - Elimina un post por `id`.
    - Responses: `204 No Content`; `404 Not Found` si no existe.

  - `GET /tags`
    - Lista tags.
  - `GET /tags/:id`
    - Obtiene un tag por `id`.
  - `POST /tags`
    - Crea un tag.
    - Request (JSON):
      ```json
      { "name": "nasa" }
      ```
    - Responses: `201 Created`; `409 Conflict` si `name` ya existe.
  - `PATCH /tags/:id`
    - Actualiza nombre del tag.
  - `DELETE /tags/:id`
    - Elimina un tag.

- Gestión de relación Post–Tag
  - Recomendado manejarla vía `tagIds` en `POST/PATCH /posts` para adjuntar/desadjuntar de forma atómica.
  - Alternativa granular (opcional): `POST /posts/:id/tags/:tagId` y `DELETE /posts/:id/tags/:tagId`.

- Códigos de estado comunes
  - `200 OK`, `201 Created`, `204 No Content`
  - `400 Bad Request`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`

- Seguridad y validaciones
  - Validar `status` contra el enum (`draft|published`).
  - Sanitizar `search` y entradas de usuario; Prisma previene inyección SQL, pero valida tipos y rangos.
  - Limitar tamaño de `content` y aplicar rate limiting en endpoints públicos en futuro.

- Documentación
  - Se documentará en Swagger/OpenAPI con ejemplos de request/response.
  - Objetivo: mantener alineado el contrato con `schema.prisma` y migraciones.

## Buenas Prácticas y Seguridad

- `.env` y claves (`DATABASE_URL`, `NASA_API_KEY`) nunca deben subirse al repo.
- Mantén simetría entre local y cloud (Vercel Postgres en prod).
- Usa ESLint/Prettier y añade pruebas unitarias a la lógica crítica.

## Referencias

- Prisma: https://www.prisma.io/docs
- Prisma Migrate: https://www.prisma.io/docs/orm/prisma-migrate
- Nest.js: https://docs.nestjs.com

## Despliegue en Vercel

### Configuración del proyecto

- Conecta el monorepo a Vercel y crea un proyecto para `apps/api`.
- Define los comandos con Yarn en Settings → Build & Development Settings:
  - Install Command: `yarn install`
  - Build Command:
    ```bash
    yarn workspace @satelite/api prisma generate && \
    yarn workspace @satelite/api prisma migrate deploy && \
    yarn workspace @satelite/api build
    ```
  - Output (según tu configuración de Nest en serverless). Si se requiere, añade `vercel.json` en el root con rutas a funciones.

### Variables de entorno (Vercel)

- Production y Preview:
  - `DATABASE_URL`: cadena de conexión de Vercel Postgres (Pool/pgbouncer).
  - `NASA_API_KEY`: clave para NasaProxy backend.
  - `NEXTAUTH_URL` y `NEXTAUTH_SECRET` (futuro: autenticación con NextAuth.js).
  - Opcional recomendado para Prisma con conexión pooleada:
    - `DIRECT_DATABASE_URL`: cadena directa (sin pool) para migraciones.
      - En entornos con pool (ej. Vercel Postgres), Prisma recomienda usar `directUrl` para `migrate deploy`.
      - Ejemplo (orientativo): `postgres://USER:PASS@HOST:PORT/DB` (tomado del dashboard de Vercel Postgres).

> Nota: En producción normalmente no necesitas `SHADOW_DATABASE_URL`. Prisma gestiona la DB sombra automáticamente si el usuario tiene permisos; en proveedores administrados se recomienda `DIRECT_DATABASE_URL` y configurar `directUrl` en el `datasource` del `schema.prisma`.

### Migraciones automáticas

- Usa `prisma migrate deploy` en el paso de build para aplicar migraciones ya generadas.
- Flujo recomendado:
  1) Generar migraciones en local: `yarn workspace @satelite/api prisma migrate dev --name <cambio>`
  2) Commit de los archivos de migración.
  3) En Vercel, durante el build: `prisma migrate deploy` aplica esas migraciones.

### Validación post-deploy

- Revisa logs de Vercel para el proyecto API (Build y Runtime) y confirma que:
  - `prisma migrate deploy` no falla.
  - Prisma Client se genera correctamente.
  - El servicio arranca sin errores.
- Comprueba tablas en Vercel Postgres con tu herramienta preferida (GUI/psql remota) o mediante endpoints de diagnóstico del API.

### Seguridad y buenas prácticas

- Mantén las variables de entorno en Vercel y rota secretos periódicamente.
- Limita permisos del usuario de base de datos al mínimo necesario.
- El tráfico externo (NASA) debe pasar por el backend (NasaProxy) para cachear, validar y evitar exponer claves.

### NextAuth (futuro)

- Variables habituales:
  - `NEXTAUTH_URL`: URL pública del sitio (incluye dominio `satelite.ar` en producción).
  - `NEXTAUTH_SECRET`: secreto para firmar tokens.
- Cuando se integre, documentar flujos OAuth y callbacks, y añadir pruebas de autorización.

### Referencias Vercel/Prisma

- Vercel Postgres: https://vercel.com/docs/storage/vercel-postgres
- Prisma con `directUrl`: https://www.prisma.io/docs/orm/prisma-client/connection-pooling#using-directurl

## Commits sugeridos

- `feat(api): add local .env and Prisma config`
- `docs(api): update README with Docker & Prisma usage`

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## Integración NASA (NasaProxy)
- Clave de entorno: `NASA_API_KEY` definida en `apps/api/.env` o variables de Vercel.
- Flujo:
  - El frontend solicita APOD (u otros recursos) vía proxy interno admin.
  - `nasa.service.ts` consulta las APIs de NASA con la `NASA_API_KEY`.
  - Se retornan datos curados (ejemplo APOD: título, explicación, fecha, url/hdurl) sin exponer secretos.
- Resultado y almacenamiento:
  - Los datos pueden utilizarse para enriquecer Posts en el dominio (guardar contenido, fecha del evento y metadatos asociados) y quedar disponibles para peticiones de usuarios.
- Seguridad:
  - Mutaciones y rutas admin se protegen con `AdminGuard` validando `x-admin-token`.

## Próximos pasos
1. Documentar Swagger/OpenAPI del CRUD con ejemplos reales.
2. Integrar nuevas APIs de NASA:
   - **EONET**: curación de eventos de desastres naturales y endpoints públicos filtrables.
   - **GIBS**: integración con capas de imágenes casi en tiempo real y metadatos relevantes (enlace con frontend para previsualización).
   - **SMAP**: ingesta de humedad de suelo, almacenamiento periódico y consultas históricas.
3. Añadir rate limiting y auditoría en endpoints públicos.
4. Ajustar `directUrl` de Prisma para migraciones seguras en Vercel.

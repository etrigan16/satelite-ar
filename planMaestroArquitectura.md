# Plan Maestro de Arquitectura: satelite.ar

## Resumen del Proyecto

- **Objetivo:** Construir un portal de curación de contenido (satelite.ar) donde el administrador (usted) pueda publicar análisis (Posts) enriqueciendo datos e imágenes de fuentes externas (como la NASA), con un enfoque en Argentina.
- **Arquitectura:** MVC Desacoplado (Microservicios).
- **Stack Tecnológico (Ecosistema Vercel):**
    - **Frontend:** Next.js (Desplegado en Vercel Edge).
    - **Backend:** Nest.js (Desplegado como Vercel Serverless Functions).
    - **Base de Datos:** Vercel Postgres (PostgreSQL gestionado).
    - **Entorno Local:** Docker (para PostgreSQL y Redis).
- **Modelo de Datos Central:** Post y Tag (relación muchos-a-muchos).

---

## Fase 0: Estrategia y Definición (Completada)

Esta fase consistió en establecer los cimientos estratégicos de la aplicación.

1. **Definición Funcional:** Proyecto tipo blog/portal ABM (CRUD), entidad principal Post (artículo).
2. **Modelo de Datos (Esquema MVP):**
    - **Post:** Análisis (título, contenido Markdown, slug), fecha del evento (eventDate), referencias a la fuente (sourceImageUrl, sourceApiName), estado (draft, published).
    - **Tag:** Gestiona temas (ej. "Incendios", "Sequía") para filtrado.
    - **Relación:** Un Post puede tener múltiples Tags y un Tag puede estar en múltiples Posts.
3. **Estrategia de Despliegue:** Prioridad ecosistema Vercel nativo. Frontend y backend en Vercel, conectados a Vercel Postgres.
4. **Arquitectura MVC:** Nest.js como Modelo/Controlador API, Next.js como Vista/Controlador UI.

---

## Fase 1: Arquitectura y Diseño (Próximo Paso)

Diseñamos los "planos" técnicos.

1. **Diseño de la Base de Datos:**
    - Herramienta: **Prisma** (ORM).
    - Entregable: archivo `schema.prisma` con modelos Post, Tag y relación PostsOnTags.
2. **Diseño del Contrato de API (API RESTful):**
    - Endpoints definidos:
        - `GET /api/posts`: Lista paginada de posts publicados.
        - `GET /api/posts?tag=sequia`: Filtrar posts por tag.
        - `GET /api/posts/:slug`: Obtener un post específico.
        - `GET /api/tags`: Lista de todos los tags.
        - **Rutas de ABM (Protegidas):**
            - `POST /api/posts`: Crear post (borrador).
            - `PATCH /api/posts/:id`: Actualizar post (estado published).
            - `DELETE /api/posts/:id`: Eliminar post.
            - `POST /api/tags`: Crear tag.
3. **Diseño de Flujo de Usuario (Wireframes):**
    - **Vista Pública (Next.js - SSG/SSR):**
        1. `/` (Home): Lista paginada de Posts publicados.
        2. `/posts/[slug]`: Detalle de Post.
        3. `/temas/[slug]`: Posts filtrados por Tag.
    - **Vista Administración (Next.js - CSR):**
        1. `/admin`: Dashboard para crear/leer/actualizar/borrar Posts y Tags.

---

## Fase 2: Configuración del Entorno (El Taller)

Preparar herramientas locales para desarrollo eficiente.

1. **Estructura del Monorepo:**
    - Herramienta: **Turborepo**.
    - Estructura:
        ```
        /satelite-ar
          ├─ /apps
          │   ├─ /web  (Next.js)
          │   └─ /api  (Nest.js)
          ├─ /packages
          │   └─ /ui   (Componentes React, opcional)
          └─ turbo.json
        ```
2. **Config Docker (Local):**
    - Archivo `docker-compose.yml`.
    - Servicios: db (Postgres), cache (Redis).
    - Nota: Solo para desarrollo local.
3. **Inicialización:**
    - Inicializar apps/web (Next.js, App Router).
    - Inicializar apps/api (Nest.js).
    - Instalar/configurar Prisma en apps/api conectado a base Docker.
4. **Conexión Vercel (Local):**
    - Instalar Vercel CLI.
    - `vercel link` para conectar el repo.
    - `vercel dev` para simular Serverless usando env vars desde docker-compose.yml.

---

## Fase 3: Desarrollo del Backend (Nest.js)

Construir lógica de negocio y API REST según contrato.

1. **Conexión y Módulos Core:**
    - Configurar PrismaModule en Nest.js.
    - `prisma migrate dev` para crear tablas en Docker local.
2. **Módulo Post (CRUD):**
    - Crear PostModule, PostController, PostService.
    - Lógica de negocio: crear slug, validar datos, gestionar draft/published.
    - Implementar endpoints REST.
3. **Módulo Tag (CRUD):**
    - Crear TagModule, TagController, TagService.
    - Implementar endpoints REST.
4. **Módulo NasaProxy (Opcional):**
    - Endpoint (`GET /api/proxy/apod`) que llama a la API NASA APOD.
    - Propósito: ocultar NASA_API_KEY en backend.
5. **Pruebas Unitarias:**
    - Usar **Jest** para unit tests en Services clave (ej. PostService).

---

## Fase 4: Desarrollo del Frontend (Next.js)

Construir interfaz de usuario que consume la API.

1. **Estructura y UI (App Router):**
    - Configurar rutas `/`, `/posts/[slug]`, `/temas/[slug]`, `/admin`.
    - Componentes UI reutilizables: PostCard, Navbar, MarkdownRenderer.
2. **Vistas Públicas (SSR):**
    - **Principal y /temas/[slug]:** React Server Components, fetch servidor llamando a `GET /api/posts`.
    - **Detalle de Post:** Generación de Sitios Estáticos (SSG, generateStaticParams) para posts publicados (SEO).
3. **Vistas Administración (CSR):**
    - `/admin` renderizado cliente.
    - Usa useEffect/SWR para llamar la API de Nest.js.
    - Formularios para crear/editar Posts y Tags.
    - *Futura mejora*: autenticar con NextAuth.js.

---

## Fase 5: Despliegue y Puesta en Marcha (Vercel)

Llevar la app de local a producción en la nube.

1. **Provisión Cloud:**
    - Dashboard de Vercel: crear proyecto y base datos Vercel Postgres.
    - Configurar DATABASE_URL de producción.
2. **Variables de Entorno:**
    - Configurar DATABASE_URL y NASA_API_KEY en Vercel.
3. **Monorepo en Vercel:**
    - Vercel detecta Turborepo.
    - Configurar apps/web (Next.js) y apps/api (Nest.js), Serverless Functions.
4. **Migración DB (Producción):**
    - Script `build-db` en package.json.
    - Ejecuta `npx prisma migrate deploy` en despliegue.
5. **Despliegue y DNS:**
    - `git push` a rama main y Vercel construye/despliega ambos proyectos.
    - Asignar dominio satelite.ar.
    - Pruebas E2E en producción.

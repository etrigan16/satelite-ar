## satelite.ar Web (Next.js App Router + shadcn-style UI)

> Trabajo Práctico Final de **Técnicas Avanzadas de la Programación** — **UMET**.
> Frontend del portal de curación con SSR/SSG, panel admin y proxies internos seguros.

Frontend del portal de curación satelite.ar.

### Páginas

- `/` Home con enlaces a Posts y Tags.
- `/posts` Listado de artículos con filtros por `status`, `tags` y `search`.
- `/posts/[id]` Detalle de artículo por ID.
- `/tags` Listado de tags.

### Dónde buscar (frontend y admin)
- Panel de administración y rutas internas: `apps/web/app/admin/*`
- Proxies internos admin (NASA, posts, sesión): `apps/web/app/admin/api/*`
- Cliente de API y tipos compartidos: `apps/web/lib/api.ts`, `apps/web/lib/types.ts`
- Componentes UI locales: `apps/web/components/ui/*`
- Formularios admin: `apps/web/components/admin/*`

### Configuración de entorno

Copiar `.env.example` a `.env.local` y ajustar `API_BASE_URL`:

```
API_BASE_URL=http://localhost:3001
```

Nota: En desarrollo, el backend Nest corre por defecto en `3000` (si no cambias `PORT`). Recomendado levantarlo en `3001` para no colisionar con el dev server de Next.

### Desarrollo

```
yarn workspace @satelite/web dev
```

Luego abre `http://localhost:3000`.

### UI (shadcn)

- Usamos componentes UI locales inspirados en shadcn (`components/ui/*`) para Button, Input, Badge y Card.
- Ventaja: no agregamos dependencias aún; podemos migrar al generador oficial de shadcn cuando definamos compatibilidad de Tailwind.
- Próximos: Select (Radix), Dialog/Sheet, Toast y Theme toggle.

### Integración NASA (APOD) y datos curados
- Cliente frontend:
  - `fetchNasaApod()` usa proxy interno admin (`/admin/api/nasa/apod`) que inyecta `x-admin-token` desde servidor.
  - `fetchNasaApodPublic()` demuestra el rewrite público (sin token) para validar guardas.
- Flujo:
  - Desde el panel admin, el formulario puede **traer APOD** para prellenar `title`, `content` y `eventDate`.
  - El resultado (título, explicación, fecha y URL) se **curan** y pueden guardarse en BD como parte de un `Post`.
- Dónde encontrar:
  - Rutas proxy: `apps/web/app/admin/api/nasa/apod/route.ts`
  - Formulario admin: `apps/web/components/admin/post-form.tsx`
  - Cliente: `apps/web/lib/api.ts`

### Seguridad y buenas prácticas

- No hardcodear URLs; usar variables de entorno.
- Manejar errores de red para evitar fallos de SSR.
- Sanitizar contenido si proviene de fuentes externas.

### Próximos pasos
1. Completar documentación de flujo admin y público.
2. Integrar más APIs de NASA:
   - **EONET**: eventos de desastres naturales con filtros en UI y páginas dedicadas.
   - **GIBS**: previsualización de imágenes satelitales casi en tiempo real (capas y tiles).
   - **SMAP**: visualización de humedad de suelo con historiales y gráficos.
3. Añadir NextAuth.js para proteger el panel admin.
4. Tests E2E con Playwright sobre CRUD y flujos de curación.

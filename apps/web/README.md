## satelite.ar Web (Next.js App Router + shadcn-style UI)

Frontend del portal de curación satelite.ar.

### Páginas

- `/` Home con enlaces a Posts y Tags.
- `/posts` Listado de artículos con filtros por `status`, `tags` y `search`.
- `/posts/[id]` Detalle de artículo por ID.
- `/tags` Listado de tags.

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

### Seguridad y buenas prácticas

- No hardcodear URLs; usar variables de entorno.
- Manejar errores de red para evitar fallos de SSR.
- Sanitizar contenido si proviene de fuentes externas.

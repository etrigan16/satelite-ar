# Reglas del Proyecto: Portal de Curación satelite.ar

## Contexto General
- Este proyecto implementa un portal de curación de contenido (tipo blog/portal) especializado en datos satelitales y análisis públicos, integrando fuentes externas (NASA/API) y orientado a Argentina.
- Arquitectura basada en **MVC desacoplado** y microservicios.
- Todos los agentes y asistentes deben alinear sus respuestas/generación a estos lineamientos.

## Stack Tecnológico
- **Frontend:** Next.js (App Router), desplegado en Vercel (Server Components/SSR/SSG).
- **Backend:** Nest.js, desplegado como Vercel Serverless Functions.
- **DB:** Vercel Postgres, desarrollo local con Docker (PostgreSQL y Redis).
- **ORM:** Prisma, con control de migraciones.

## Modelo de Datos y Funcionalidad
- Modelo central: `Post` (artículo) con relación muchos-a-muchos con `Tag`.
- CRUD completo para Posts y Tags. Estados permitidos para Post: `draft` y `published`.
- API contract RESTful definido, con endpoints claros para manipular Posts y Tags.
- Los endpoints de administración inicialmente no requieren login, pero considerar autenticación futura (NextAuth.js).

## Flujo de Trabajo y Monorepo
- Estructura y administración del monorepo con Turborepo.
- Desarrollo local debe simular producción mediante Docker y el uso de Vercel CLI.
- Mantener simetría entre entornos local y cloud para evitar desvíos de configuración.

## Pruebas y Calidad
- Uso obligatorio de pruebas unitarias (Jest) para lógica de negocio crítica.
- Mantener contratos de la API y la base de datos alineados mediante migraciones y documentación (schema.prisma + Swagger/OpenAPI).

## Despliegue y Producción
- Todas las configuraciones de entorno (`DATABASE_URL`, `NASA_API_KEY`) manejarse mediante variables de entorno.
- Deploy en Vercel, integración del dominio satelite.ar y migraciones automáticas de base de datos en el build.

## Referencias y Fuentes
- Citar y documentar fuentes externas integradas (ej: NASA API).
- Todos los datos externos deben pasar por el backend (NasaProxy).

## Estilo de Código y Buenas Prácticas
- Seguir convenciones de la comunidad (prettier, eslint).
- Comentarios descriptivos en código generado automáticamente si lo requiere el usuario.
- Código generado debe ser modular y fácil de testear.

---
## Reglas para Generación/Asistencia

- Siempre generar primero el archivo de contrato de datos (`schema.prisma`) antes de los controladores.
- Documentar cada endpoint en la API al momento de sugerir/generar código.
- Usar el inglés en nombres de variables, pero permitir descripciones/comentarios en español.
- Cuando el usuario solicite ejemplos, los componentes sugeridos deben tener casos básicos y ejemplos de integración.
- Consultar siempre antes de realizar cambios estructurales en la base de datos o los endpoints de

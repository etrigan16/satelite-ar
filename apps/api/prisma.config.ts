// Prisma Config para el servicio API (Nest.js)
// - Carga .env del root del monorepo para usar DATABASE_URL
// - Define ubicación del schema y carpeta de migraciones
// Nota: Este archivo evita problemas al ejecutar comandos desde distintos CWD.

import path from "path";
import { config as dotenvConfig } from "dotenv";
// Carga el .env local del workspace API
dotenvConfig({ path: path.resolve(__dirname, ".env") });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Prisma buscará el schema en esta ruta relativa al workspace
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Mantenemos el engine clásico (por defecto)
  engine: "classic",
  // Toma la URL desde variables de entorno
  datasource: {
    url: env("DATABASE_URL"),
  },
});
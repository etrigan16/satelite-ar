import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

// Servicio de Prisma: encapsula PrismaClient y gestiona ciclo de vida.
// Buenas prácticas: cerrar conexiones al apagar la app.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Establece conexión con la base de datos al iniciar el módulo
    // Mejora: en desarrollo, no bloquear el arranque si la DB no está disponible.
    // Esto permite usar endpoints que no dependen de Prisma (p.ej. NASA/APOD).
    try {
      await this.$connect();
    } catch (err: any) {
      // En producción, se debe fallar rápido para no ocultar problemas.
      const isDev = process.env.NODE_ENV !== "production";
      if (isDev) {
        console.warn(
          "[PrismaService] $connect() falló. Continuando sin DB en desarrollo:",
          err?.message || err,
        );
      } else {
        throw err;
      }
    }
  }

  async onModuleDestroy() {
    // Cierra conexión cuando el módulo se destruye
    await this.$disconnect();
  }

  // Hook para cerrar Prisma al apagar la app de Nest
  async enableShutdownHooks(app: INestApplication) {
    // Nota: En Prisma v6, la firma tipada de $on ya no incluye 'beforeExit',
    // lo cual causa errores de TypeScript. Usamos el evento de Node.js.
    process.on("beforeExit", async () => {
      await app.close();
    });
    // Opcionalmente cerramos también ante SIGINT (Ctrl+C) en desarrollo.
    process.on("SIGINT", async () => {
      await app.close();
      process.exit(0);
    });
  }
}
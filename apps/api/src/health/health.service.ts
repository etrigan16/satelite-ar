import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

// Service de salud del sistema
// Verifica la disponibilidad de la base de datos mediante una consulta simple.
@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async checkDb() {
    try {
      // Consulta mínima para validar conectividad
      await this.prisma.$queryRawUnsafe("SELECT 1");
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err?.message || "db check failed" };
    }
  }

  async health() {
    const db = await this.checkDb();
    // api.ok true porque el endpoint respondió
    return { api: { ok: true }, db };
  }
}
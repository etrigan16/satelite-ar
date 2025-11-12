import { Controller, Get } from "@nestjs/common";
import { HealthService } from "./health.service";

// Controlador de salud del backend
// Exposición: GET /health
// Retorna estado de API (si este endpoint responde) y DB.
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async health() {
    return this.healthService.health();
  }
}
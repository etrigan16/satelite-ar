// Controller Nasa: expone endpoints bajo /nasa
// Añadimos /nasa/apod protegido con AdminGuard y soporte de query date.
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { NasaService } from './nasa.service';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('nasa')
export class NasaController {
  constructor(private readonly nasaService: NasaService) {}

  // Endpoint simple para validar módulo (no protegido)
  @Get('health')
  health() {
    return { ok: true };
  }

  /**
   * GET /nasa/apod
   * - Obtiene Astronomy Picture of the Day desde la API de NASA
   * - Protegido por AdminGuard (requiere header 'x-admin-token')
   * - Parámetros: `date` (YYYY-MM-DD) opcional
   * Seguridad: la clave NASA nunca se expone; el backend realiza la llamada.
   */
  @UseGuards(AdminGuard)
  @Get('apod')
  async apod(@Query('date') date?: string) {
    // Validación básica del formato de fecha (opcional)
    if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { error: 'Formato de fecha inválido. Use YYYY-MM-DD' };
    }
    return this.nasaService.getApod(date);
  }
}
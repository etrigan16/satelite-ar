// Controlador Nasa: expone el endpoint seguro /nasa/apod
import { Controller, Get, UseGuards, Logger, Query } from '@nestjs/common';
import { NasaService, ApodResponse } from './nasa.service';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('nasa') // Ruta base: /nasa
export class NasaController {
  private readonly logger = new Logger(NasaController.name);

  constructor(private readonly nasaService: NasaService) {}

  /**
   * Endpoint para obtener la Foto Astronómica del Día (APOD).
   * Protegido solo para administradores (evita abuso de cuota NASA).
   */
  @Get('apod') // Ruta completa: GET /nasa/apod
  @UseGuards(AdminGuard) // Seguridad CRÍTICA
  async getApod(@Query('date') date?: string): Promise<ApodResponse> {
    // Documentación: permite ?date=YYYY-MM-DD para obtener APOD de una fecha específica
    this.logger.log(
      `Recibida solicitud para /nasa/apod${date ? ` con date=${date}` : ''}`,
    );
    return this.nasaService.getApod(date);
  }
}

// Servicio Nasa: cerebro del proxy hacia la API de NASA (APOD)
// Implementa integración segura, lectura de configuración y formateo de respuesta.
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// DTO: contrato de datos simplificado que devolvemos al frontend
export interface ApodResponse {
  title: string;
  explanation: string;
  date: string; // YYYY-MM-DD
  hdurl: string | null;
  url: string;
}

@Injectable()
export class NasaService {
  private readonly logger = new Logger(NasaService.name);
  private readonly apiKey: string;
  private readonly apodBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService, // Inyectado gracias al ConfigModule global
  ) {
    // Obtenemos la API Key de forma segura desde las variables de entorno
    this.apiKey = this.configService.get<string>('NASA_API_KEY') as string;
    if (!this.apiKey) {
      this.logger.error('NASA_API_KEY no está configurada en .env');
      throw new Error('NASA_API_KEY no está configurada');
    }
    // Base URL oficial de APOD
    this.apodBaseUrl = 'https://api.nasa.gov/planetary/apod';
  }

  /**
   * Obtiene la "Foto Astronómica del Día" (APOD).
   * Seguridad: la clave nunca se expone al cliente, solo el backend llama a NASA.
   */
  /**
   * Permite opcionalmente solicitar APOD para una fecha específica (YYYY-MM-DD).
   * Si no se provee fecha, usa el día actual.
   */
  async getApod(date?: string): Promise<ApodResponse> {
    this.logger.log('Contactando API de NASA APOD...');
    try {
      // Construimos URL con parámetros seguros
      const url = new URL(this.apodBaseUrl);
      url.searchParams.set('api_key', this.apiKey);
      if (date) {
        url.searchParams.set('date', date);
      }
      // Convertimos Observable en Promesa
      const { data } = await firstValueFrom(this.httpService.get(url.toString()));

      // Formateo: devolvemos solo campos necesarios por el frontend
      return {
        title: data.title,
        explanation: data.explanation,
        date: data.date,
        hdurl: data.hdurl || null, // asegurar null si no existe
        url: data.url,
      };
    } catch (error: any) {
      // Manejo robusto: log y excepción controlada
      const status = error?.response?.status;
      const payload = error?.response?.data;
      this.logger.error('Error al contactar la API de NASA', payload);
      // En desarrollo, proveemos más contexto para diagnóstico
      const isDev = process.env.NODE_ENV !== 'production';
      if (isDev) {
        throw new InternalServerErrorException({
          message: 'Error al obtener datos de la API de NASA',
          statusCode: status ?? 500,
          nasa: payload ?? null,
        } as any);
      }
      throw new InternalServerErrorException('Error al obtener datos de la API de NASA');
    }
  }
}
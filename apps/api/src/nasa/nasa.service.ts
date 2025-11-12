// Service Nasa: encapsula integración con la API NASA APOD.
// Implementa getApod(date?) leyendo NASA_API_KEY desde variables de entorno.
// Seguridad: nunca exponer la clave al cliente; todas las llamadas deben pasar por este Service.
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

type ApodRaw = {
  copyright?: string;
  date: string; // YYYY-MM-DD
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version?: string;
  title: string;
  url: string;
  thumbnail_url?: string; // algunos videos incluyen thumbnail
};

export type ApodDto = {
  title: string;
  explanation: string;
  date: string;
  mediaType: 'image' | 'video';
  url: string;
  hdUrl?: string;
  thumbnailUrl?: string;
  copyright?: string;
};

@Injectable()
export class NasaService {
  constructor(private readonly http: HttpService) {}

  /**
   * getApod: obtiene Astronomy Picture of the Day.
   * - Si `NASA_API_KEY` contiene una URL completa, la usa directamente.
   * - Si `NASA_API_KEY` contiene sólo la clave, compone la URL oficial.
   * - Admite query `date=YYYY-MM-DD` para obtener días anteriores.
   */
  async getApod(date?: string): Promise<ApodDto> {
    const envVal = process.env.NASA_API_KEY;
    if (!envVal) {
      throw new Error('NASA_API_KEY no configurada');
    }
    // Componer URL de APOD según formato de env
    const baseUrl = envVal.includes('http')
      ? envVal // soporta formato completo con api_key ya incluido
      : `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(envVal)}`;

    const url = date ? `${baseUrl}&date=${encodeURIComponent(date)}` : baseUrl;
    const obs = this.http.get<ApodRaw>(url, {
      // Cabeceras estándar; API pública no requiere auth adicional
      headers: { 'Accept': 'application/json' },
      // No enviar cookies
      withCredentials: false,
      // Validación TLS por defecto
    });
    const res = await firstValueFrom(obs);
    if (res.status !== 200 || !res.data) {
      throw new Error(`NASA APOD error: ${res.status}`);
    }
    const data = res.data;
    // Sanitizar/simplificar payload para el cliente
    const dto: ApodDto = {
      title: data.title,
      explanation: data.explanation,
      date: data.date,
      mediaType: data.media_type,
      url: data.url,
      hdUrl: data.hdurl,
      thumbnailUrl: data.thumbnail_url,
      copyright: data.copyright,
    };
    return dto;
  }
}
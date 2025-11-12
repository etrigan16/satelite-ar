// Módulo Nasa: tuberías de inyección para HttpModule y ConfigModule
import { Module } from '@nestjs/common';
import { NasaController } from './nasa.controller';
import { NasaService } from './nasa.service';
import { HttpModule } from '@nestjs/axios'; // Cliente HTTP basado en axios
import { ConfigModule } from '@nestjs/config'; // Acceso a variables de entorno

@Module({
  imports: [
    // Configuramos HttpModule con timeout y headers amigables
    // Mejora: reduce fallas transitorias de red y proporciona User-Agent explícito.
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
      headers: {
        // No exponer secretos en headers; sólo identificación básica del cliente
        'User-Agent': 'satelite.ar-api/1.0 (NestJS HttpModule)'
      },
    }),
    ConfigModule, // Permite inyectar ConfigService
  ],
  controllers: [NasaController],
  providers: [NasaService],
})
export class NasaModule {}
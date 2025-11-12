// Módulo Nasa: encapsula integraciones con la API de NASA (APOD, etc.)
// Parte 2: añadimos HttpModule para realizar llamadas HTTP a APIs externas.
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NasaController } from './nasa.controller';
import { NasaService } from './nasa.service';

@Module({
  imports: [
    // HttpModule proporciona HttpService con axios bajo el capó.
    // Ajustamos timeout razonable para evitar bloqueos prolongados.
    HttpModule.register({ timeout: 7000, maxRedirects: 5 }),
  ],
  controllers: [NasaController],
  providers: [NasaService],
})
export class NasaModule {}
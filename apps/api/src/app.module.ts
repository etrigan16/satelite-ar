import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Configuración global de variables de entorno (.env)
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { TagsModule } from './tags/tags.module';
import { NasaModule } from './nasa/nasa.module'; // Módulo para integraciones con NASA (APOD)
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Carga variables de entorno de forma global.
    // En desarrollo, aseguramos leer tanto el .env raíz como apps/api/.env
    // para evitar depender del directorio de trabajo.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? undefined
          : [
              path.resolve(process.cwd(), '.env'),
              path.resolve(process.cwd(), 'apps/api/.env'),
            ],
    }),
    PrismaModule,
    PostsModule,
    TagsModule,
    NasaModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

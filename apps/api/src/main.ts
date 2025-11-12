import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global de DTOs
  // Explicación: whitelist elimina propiedades no declaradas en DTOs,
  // forbidNonWhitelisted rechaza payloads con campos extra y transform castea tipos.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger opcional (solo si ENABLE_SWAGGER=true)
  // Requiere devDependencies: @nestjs/swagger y swagger-ui-express
  if (process.env.ENABLE_SWAGGER === 'true') {
    try {
      // @ts-ignore: Import opcional solo si el paquete está instalado
      const swagger = await import('@nestjs/swagger');
      const { SwaggerModule, DocumentBuilder } = swagger as any;

      const config = new DocumentBuilder()
        .setTitle('satelite.ar API')
        .setDescription('Contrato REST para Posts y Tags')
        .setVersion('1.0.0')
        .build();
      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document);
      // Accede a http://localhost:3000/docs para ver Swagger UI
    } catch (err) {
      console.warn('Swagger no habilitado: instala @nestjs/swagger para activar documentación');
    }
  }
  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? '127.0.0.1';
  await app.listen(port, host);
  console.log(`[API] Listening on http://${host}:${port}`);
}
bootstrap();

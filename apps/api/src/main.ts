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
      // @ts-expect-error: Import opcional solo si el paquete está instalado
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const swagger = await import('@nestjs/swagger');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const SwaggerModule = swagger.SwaggerModule;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const DocumentBuilder = swagger.DocumentBuilder;

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const config = new DocumentBuilder()
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .setTitle('satelite.ar API')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .setDescription('Contrato REST para Posts y Tags')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .setVersion('1.0.0')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .build();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const document = SwaggerModule.createDocument(app, config);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      SwaggerModule.setup('docs', app, document);
      // Accede a http://localhost:3000/docs para ver Swagger UI
    } catch {
      console.warn(
        'Swagger no habilitado: instala @nestjs/swagger para activar documentación',
      );
    }
  }
  const port = Number(process.env.PORT ?? 3001);
  const host = process.env.HOST ?? '127.0.0.1';
  await app.listen(port, host);
  console.log(`[API] Listening on http://${host}:${port}`);
}
void bootstrap();

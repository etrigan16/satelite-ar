import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// Módulo global para exponer PrismaService en toda la app
// Comentario: esto evita tener que importar el módulo en cada feature.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

// Guard de administrador por token simple.
// Seguridad: valida header 'x-admin-token' contra variable de entorno ADMIN_API_TOKEN.
// Recomendación: migrar a JWT y roles cuando definamos usuarios.
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string | undefined> }>();
    const token = req.headers['x-admin-token'];
    const expected = process.env.ADMIN_API_TOKEN;
    if (!expected || token !== expected) {
      throw new UnauthorizedException('Admin token inválido o ausente');
    }
    return true;
  }
}

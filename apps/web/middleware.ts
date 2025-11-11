// Middleware para proteger rutas /admin/** con una cookie de sesión de administrador.
// Explicación: si la cookie 'admin_session' no coincide con ADMIN_UI_SESSION_TOKEN, redirige a /admin/login.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = { matcher: ['/admin/:path*'] };

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Evitar bucles: permitir libre acceso a la pantalla y API de login.
  if (pathname.startsWith('/admin/login') || pathname.startsWith('/admin/api')) {
    return NextResponse.next();
  }

  const session = req.cookies.get('admin_session')?.value;
  const expected = process.env.ADMIN_UI_SESSION_TOKEN;

  if (!expected || !session || session !== expected) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    // Si el destino es la propia pantalla de login, usar /admin como next para evitar loops.
    const nextPath = pathname.startsWith('/admin/login') ? '/admin' : pathname;
    url.search = `next=${encodeURIComponent(nextPath)}`;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
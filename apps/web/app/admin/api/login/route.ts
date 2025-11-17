// Ruta de login admin: valida user/pass contra variables de entorno y setea cookie 'admin_session'.
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const expectedUser = process.env.ADMIN_UI_USER;
    const expectedPass = process.env.ADMIN_UI_PASS;
    const sessionToken = process.env.ADMIN_UI_SESSION_TOKEN;
    if (!expectedUser || !expectedPass || !sessionToken) {
      return NextResponse.json({ error: 'ADMIN env no configuradas' }, { status: 500 });
    }
    if (username !== expectedUser || password !== expectedPass) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }
    const res = NextResponse.json({ success: true });
    res.cookies.set('admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hora
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Formato inválido' }, { status: 400 });
  }
}
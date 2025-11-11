import { NextRequest, NextResponse } from 'next/server';

// Endpoint para verificar sesión admin actual de forma segura desde el cliente.
export async function GET(req: NextRequest) {
  const expected = process.env.ADMIN_UI_SESSION_TOKEN;
  if (!expected) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  const session = req.cookies.get('admin_session')?.value;
  const ok = Boolean(session && session === expected);
  return NextResponse.json({ authenticated: ok }, { status: 200 });
}
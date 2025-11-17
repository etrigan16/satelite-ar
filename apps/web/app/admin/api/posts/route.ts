// Proxy interno de creación de Post: inyecta x-admin-token desde el servidor.
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const token = process.env.ADMIN_API_TOKEN;
    const apiBase = process.env.API_BASE_URL || 'http://localhost:3001';
    if (!token) return NextResponse.json({ error: 'ADMIN_API_TOKEN no configurado' }, { status: 500 });
    const res = await fetch(`${apiBase}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify(payload),
    });
    let dataUnknown: unknown = {};
    try { dataUnknown = await res.json(); } catch { dataUnknown = {}; }
    const data = dataUnknown as Record<string, unknown>;
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }
}
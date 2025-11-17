// Proxy interno de APOD (NASA) para administración.
// Endpoint: GET /admin/api/nasa/apod?date=YYYY-MM-DD
// Seguridad: inyecta x-admin-token desde el servidor; nunca expone secretos al cliente.
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get('date') || undefined;
    const token = process.env.ADMIN_API_TOKEN;
    const apiBase = process.env.API_BASE_URL || 'http://localhost:3001';
    if (!token) return NextResponse.json({ error: 'ADMIN_API_TOKEN no configurado' }, { status: 500 });

    const qs = date ? `?date=${encodeURIComponent(date)}` : '';
    const res = await fetch(`${apiBase}/nasa/apod${qs}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      cache: 'no-store',
    });
    let dataUnknown: unknown = {};
    try { dataUnknown = await res.json(); } catch { dataUnknown = {}; }
    const data = dataUnknown as Record<string, unknown>;
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Error interno del proxy APOD' }, { status: 500 });
  }
}
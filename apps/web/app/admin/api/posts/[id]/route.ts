// API interna de actualización de Post (admin). Proxy a backend con x-admin-token.
// Endpoint: PATCH /admin/api/posts/[id]
// Seguridad: el token ADMIN_API_TOKEN NUNCA se expone en el cliente; se inyecta server-side.
import { NextRequest, NextResponse } from 'next/server';

// Next.js 16: el contexto entrega params como Promise y el request es NextRequest.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await req.json();
    const { id } = await params;
    const token = process.env.ADMIN_API_TOKEN;
    const apiBase = process.env.API_BASE_URL || 'http://localhost:3001';
    if (!token) return NextResponse.json({ error: 'ADMIN_API_TOKEN no configurado' }, { status: 500 });
    const res = await fetch(`${apiBase}/posts/${id}`, {
      method: 'PATCH',
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

// Opcional: soportar PUT según el backend
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const payload = await req.json();
    const { id } = await params;
    const token = process.env.ADMIN_API_TOKEN;
    const apiBase = process.env.API_BASE_URL || 'http://localhost:3001';
    if (!token) return NextResponse.json({ error: 'ADMIN_API_TOKEN no configurado' }, { status: 500 });
    const res = await fetch(`${apiBase}/posts/${id}`, {
      method: 'PUT',
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
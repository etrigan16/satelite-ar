// API interna de actualización de Post (admin). Proxy a backend con x-admin-token.
// Endpoint: PATCH /admin/api/posts/[id]
// Seguridad: el token ADMIN_API_TOKEN NUNCA se expone en el cliente; se inyecta server-side.
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await req.json();
    const token = process.env.ADMIN_API_TOKEN;
    const apiBase = process.env.API_BASE_URL || 'http://localhost:3001';
    if (!token) return NextResponse.json({ error: 'ADMIN_API_TOKEN no configurado' }, { status: 500 });
    const res = await fetch(`${apiBase}/posts/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }
}

// Opcional: soportar PUT según el backend
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const payload = await req.json();
    const token = process.env.ADMIN_API_TOKEN;
    const apiBase = process.env.API_BASE_URL || 'http://localhost:3001';
    if (!token) return NextResponse.json({ error: 'ADMIN_API_TOKEN no configurado' }, { status: 500 });
    const res = await fetch(`${apiBase}/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 });
  }
}
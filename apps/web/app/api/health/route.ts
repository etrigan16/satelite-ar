// Ruta pública de salud del backend
// Objetivo: consultar el estado del API (no protegido) y exponerlo al frontend
// Seguridad: no expone secretos; usa API_BASE_URL del servidor y fallback a localhost:3001 en dev
import { NextResponse } from 'next/server';

// Helper: normaliza API_BASE_URL para asegurar que sea sólo el origen (scheme+host+port)
// Ejemplo: "http://127.0.0.1:3001/health" -> "http://127.0.0.1:3001"
function normalizeOrigin(input: string) {
  try {
    const u = new URL(input);
    const port = u.port ? `:${u.port}` : '';
    return `${u.protocol}//${u.hostname}${port}`;
  } catch {
    // Si no es una URL válida, quitamos barras finales y devolvemos tal cual
    return input.replace(/\/+$/, '');
  }
}

export async function GET() {
  // Preferimos 127.0.0.1 en Windows para evitar resoluciones IPv6 de 'localhost'
  const rawBase = process.env.API_BASE_URL || 'http://127.0.0.1:3001';
  const apiBase = normalizeOrigin(rawBase);
  try {
    // Nuevo contrato: consulta /health del backend para conocer estado de DB
    const res = await fetch(`${apiBase}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, source: 'api', error: `HTTP ${res.status}` }, { status: 200 });
    }
    let dataUnknown: unknown = {};
    try {
      dataUnknown = await res.json();
    } catch {
      dataUnknown = {};
    }
    const data = dataUnknown as { api?: { ok?: boolean }; db?: { ok?: boolean; error?: string } };
    const ok = Boolean(data.api?.ok && data.db?.ok);
    return NextResponse.json({ ok, source: 'api', db: data.db }, { status: 200 });
  } catch {
    // Fallback: si /health falla, intentamos /nasa/health para distinguir API caído total
    try {
      // Intentamos primero host normalizado, luego localhost si el primero falla
      const tryHosts = [apiBase, normalizeOrigin(process.env.API_BASE_URL || 'http://localhost:3001')];
      let ok2 = false;
      for (const base of tryHosts) {
        try {
          const res2 = await fetch(`${base}/nasa/health`, { method: 'GET', cache: 'no-store' });
          let payload: unknown = {};
          if (res2.ok) {
            try { payload = await res2.json(); } catch { payload = {}; }
          }
          ok2 = (payload as { ok?: boolean }).ok === true;
          if (ok2) break;
        } catch {
          // continúa con siguiente host
        }
      }
      return NextResponse.json({ ok: ok2, source: 'api', db: { ok: false, error: 'db or health endpoint down' } }, { status: 200 });
    } catch {
      return NextResponse.json({ ok: false, source: 'api', db: { ok: false, error: 'api unreachable' } }, { status: 200 });
    }
  }
}
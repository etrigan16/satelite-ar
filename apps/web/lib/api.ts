// API client para el frontend (Next.js App Router)
// Objetivo: centralizar base URL y métodos de lectura para Posts y Tags.
// Seguridad: no exponemos secretos; usamos envs del servidor cuando sea posible.
import type { Post, Tag } from "./types";

// Base URL: preferir API_BASE_URL en servidor; fallback a NEXT_PUBLIC_API_BASE_URL en cliente.
// Nota: en desarrollo el backend Nest suele correr en 3001.
// Ajustamos el fallback para evitar apuntar al dev server de Next (3000),
// que no expone los endpoints REST del backend.
const baseUrl =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:3001";

// Helper básico de fetch con manejo de errores
async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    // En Server Components, Next.js puede cachear; usamos no-store para datos frescos
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) {
    throw new Error(`API GET failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export async function getPosts(params?: { status?: "draft" | "published"; tagIds?: string[]; search?: string }) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.search) q.set("search", params.search);
  if (params?.tagIds && params.tagIds.length > 0) q.set("tagIds", params.tagIds.join(","));
  return apiGet<Post[]>(`/posts${q.size > 0 ? `?${q.toString()}` : ""}`);
}

export async function getPostById(id: string) {
  return apiGet<Post>(`/posts/${id}`);
}

export async function getTags() {
  return apiGet<Tag[]>(`/tags`);
}

export async function getTagBySlug(slug: string) {
  const tags = await getTags();
  return tags.find((t) => t.slug === slug);
}

// Conveniencia: obtener un Post por slug cuando el backend no tiene endpoint dedicado.
export async function getPostBySlug(slug: string) {
  const posts = await getPosts({ search: slug });
  return posts.find((p) => p.slug === slug);
}

// --- NASA APOD ---
// Nota: Para endpoints protegidos, usamos el proxy interno /admin/api/* que inyecta el token.
// Este método está pensado para uso desde componentes cliente o servidor sin exponer secretos.
export async function fetchNasaApod(date?: string) {
  const qs = date ? `?date=${encodeURIComponent(date)}` : '';
  const res = await fetch(`/admin/api/nasa/apod${qs}`, {
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.error || `APOD fetch failed: ${res.statusText}`);
  }
  return res.json();
}
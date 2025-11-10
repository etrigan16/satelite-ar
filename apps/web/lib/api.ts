// API client para el frontend (Next.js App Router)
// Objetivo: centralizar base URL y métodos de lectura para Posts y Tags.
// Seguridad: no exponemos secretos; usamos NEXT_PUBLIC_API_BASE_URL para URLs públicas.

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "DRAFT" | "PUBLISHED";
  eventDate: string;
  sourceApiName?: string | null;
  sourceImageUrl?: string | null;
  sourceDataUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  tags?: Tag[];
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

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
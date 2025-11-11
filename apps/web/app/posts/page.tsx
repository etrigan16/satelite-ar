// Página de listado de Posts (SSR por defecto en App Router)
// Lee parámetros de búsqueda desde searchParams y consulta al backend.

import { getPosts, getTags } from "../../lib/api";
import { Suspense } from "react";
import PostCard from "../../components/PostCard";
import SearchFilter from "../../components/SearchFilter";

type PageProps = {
  searchParams?: {
    status?: "draft" | "published";
    tagIds?: string;
    search?: string;
  };
};

export default async function PostsPage({ searchParams }: PageProps) {
  const status = typeof searchParams?.status === "string" ? searchParams!.status : undefined;
  const tagIds = typeof searchParams?.tagIds === "string"
    ? searchParams!.tagIds.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;
  const search = typeof searchParams?.search === "string" ? searchParams!.search : undefined;

  // Consultas al backend; en caso de error se devuelven arrays vacíos
  const [posts, tags] = await Promise.all([
    getPosts({ status, tagIds, search }),
    getTags(),
  ]);

  return (
    <main className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Artículos</h1>
      <p className="text-sm text-gray-600 mb-2">Listado de publicaciones con filtros por estado, tags y búsqueda.</p>

      {/* En Next 16, componentes cliente con hooks de navegación deben estar bajo Suspense */}
      <Suspense fallback={<div className="text-sm text-gray-500">Cargando filtros...</div>}>
        <SearchFilter tags={tags} />
      </Suspense>

      {posts.length === 0 ? (
        <p className="text-sm text-gray-500">No hay resultados. Ajusta filtros o crea contenido.</p>
      ) : (
        <section className="grid gap-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </section>
      )}
    </main>
  );
}

// Forzar renderizado dinámico porque usamos consultas sin caché hacia la API
export const dynamic = "force-dynamic";
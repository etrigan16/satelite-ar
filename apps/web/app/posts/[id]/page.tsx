// Página de detalle de un Post por ID
// Renderiza título, contenido, metadatos y tags

import { notFound } from "next/navigation";
import { getPostById } from "@/lib/api";

type PageProps = {
  params: { id: string };
};

export default async function PostDetailPage({ params }: PageProps) {
  let post = null as Awaited<ReturnType<typeof getPostById>> | null;
  try {
    post = await getPostById(params.id);
  } catch (err) {
    // Si el backend no responde o hay error, devolvemos 404
    notFound();
  }
  if (!post) {
    notFound();
  }
  const eventDate = post.eventDate ? new Date(post.eventDate).toLocaleString("es-AR") : "";

  return (
    <main className="container mx-auto max-w-3xl px-4 py-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <p className="text-sm text-gray-600">{post.status} • {eventDate}</p>
      </header>
      <article className="prose">
        <p>{post.content}</p>
      </article>
      <footer className="mt-6">
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((t) => (
            <span key={t.id} className="text-xs bg-gray-100 border rounded px-2 py-1">#{t.name}</span>
          ))}
        </div>
      </footer>
    </main>
  );
}

// El detalle consulta datos por id en tiempo de petición
export const dynamic = "force-dynamic";
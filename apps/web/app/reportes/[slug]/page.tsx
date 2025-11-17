// Página de detalle de reporte por slug
// Propósito: mostrar título, fecha, tags y contenido completo del Post.
// Seguridad: el slug viene de la URL; el backend debe sanear y validar.
// Buenas prácticas: manejar 404 si no existe, y no renderizar HTML no confiable.

import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPostBySlug } from "@/lib/api";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ReportDetailPage({ params }: PageProps) {
  // Obtiene el post por slug desde el backend.
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    // Si no existe el recurso, devolvemos 404
    notFound();
  }

  const formattedDate = new Date(post.eventDate).toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto max-w-3xl px-6 py-10">
      {/* Breadcrumb simple */}
      <div className="mb-4 text-sm text-muted-foreground">
        <Link href="/">Inicio</Link> {" / "}
        <Link href="/posts">Reportes</Link> {" / "}
        <span className="text-foreground">{post.title}</span>
      </div>

      {/* Título y metadatos */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">{formattedDate}</span>
          {(post.tags ?? []).map((t) => (
            <Badge key={t.id} variant="secondary">
              {t.name}
            </Badge>
          ))}
        </div>
      </header>

      {/* Contenido (texto plano) */}
      <article className="prose prose-sm md:prose base leading-7">
        {/* Nota: el contenido es texto; si fuera HTML/Markdown, usaríamos sanitización */}
        <p className="whitespace-pre-line">{post.content}</p>
      </article>

      {/* CTA / Navegación */}
      <div className="mt-8 flex items-center gap-3">
        <Button asChild variant="default">
          <Link href="/contacto">Hablar con un experto</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/posts">Volver a reportes</Link>
        </Button>
      </div>
    </div>
  );
}
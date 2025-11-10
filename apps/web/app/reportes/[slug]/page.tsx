// Detalle de Reporte (B2B): layout de 2 columnas (70/30).
// Columna principal: Header + TL;DR + Cuerpo del análisis + CTA.
// Columna secundaria: Evidencia (metadata, fuente, link externo a NASA).
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPostBySlug } from "@/lib/api";

export const dynamic = "force-dynamic";

type Params = { params: { slug: string } };

export default async function ReportDetailPage({ params }: Params) {
  const { slug } = params;
  let post = null as Awaited<ReturnType<typeof getPostBySlug>> | null;
  try {
    post = await getPostBySlug(slug);
  } catch (err) {
    post = null;
  }
  if (!post) {
    return (
      <div className="container mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-2xl font-bold mb-4">Reporte no encontrado</h1>
        <p className="text-muted-foreground">No existe un reporte con el slug solicitado.</p>
      </div>
    );
  }
  const sector = post.tags && post.tags.length > 0 ? post.tags[0].name : "General";
  const publishedAt = post.createdAt ? new Date(post.createdAt).toLocaleDateString("es-AR") : "";
  const captureDate = post.eventDate ? new Date(post.eventDate).toLocaleDateString("es-AR") : "";
  const nasaUrl = post.sourceDataUrl || post.sourceImageUrl || undefined;

  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* Columna principal (70%) */}
        <div className="lg:col-span-5">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{sector}</Badge>
              <span className="text-xs text-muted-foreground">Publicado: {publishedAt}</span>
            </div>
            <h1 className="text-3xl font-bold">{post.title}</h1>
          </div>

          {/* TL;DR */}
          <blockquote className="border-l-4 pl-4 italic text-muted-foreground mb-6">
            {/* TL;DR opcional: usa los primeros 160 caracteres del contenido si no hay resumen */}
            {(post.content || "").slice(0, 160)}...
          </blockquote>

          {/* Cuerpo del análisis (prose) */}
          <div className="prose prose-neutral max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>

          {/* CTA dentro del contenido */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>¿Cómo aplica esto a su organización?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Podemos generar un reporte personalizado con foco en su operación y riesgos.
              </p>
              <Link href="/contacto"><Button>Solicitar un reporte personalizado</Button></Link>
            </CardContent>
          </Card>
        </div>

        {/* Columna secundaria (30%) */}
        <aside className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Evidencia Satelital</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2">
                <li><span className="font-medium">Fuente API:</span> {post.sourceApiName || "(no especificada)"}</li>
                <li><span className="font-medium">Fecha de Captura:</span> {captureDate || "(no disponible)"}</li>
              </ul>
              <div className="mt-4">
                {nasaUrl ? (
                  <a className="text-sm underline" href={nasaUrl} target="_blank" rel="noopener noreferrer">
                  Ver datos crudos en NASA
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Sin enlace externo</span>
                )}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
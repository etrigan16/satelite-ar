// Página de listado de reportes (B2B): filtrable por sector en el futuro.
// Usamos Card + Badge (shadcn-style) y enlaces a detalle.
import { ReportCard } from "@/components/shared/report-card";
import { getPosts } from "@/lib/api";

export const dynamic = "force-dynamic";

// Los datos ahora provienen del backend Nest + Prisma
// Se filtran por status=published

export default async function ReportesPage() {
  let posts = [] as Awaited<ReturnType<typeof getPosts>>;
  try {
    posts = await getPosts({ status: "published" });
  } catch (err) {
    // Fallback seguro si el backend no está disponible
    posts = [];
  }
  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">Reportes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No hay reportes publicados aún.</p>
        ) : (
          posts.map((p) => (
            <ReportCard
              key={p.id}
              title={p.title}
              sector={p.tags && p.tags.length > 0 ? p.tags[0].name : "General"}
              slug={p.slug}
              tags={(p.tags || []).map((t) => t.name)}
              summary={"Ver análisis detallado →"}
            />
          ))
        )}
      </div>
    </div>
  );
}
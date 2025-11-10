// Página que filtra reportes por sector.
import { ReportCard } from "@/components/shared/report-card";
import { getTagBySlug, getPosts } from "@/lib/api";

type Params = { params: { sector: string } };

export default async function SectorPage({ params }: Params) {
  const { sector } = params;
  let tag = null as Awaited<ReturnType<typeof getTagBySlug>> | null;
  let posts = [] as Awaited<ReturnType<typeof getPosts>>;
  try {
    tag = await getTagBySlug(sector);
  } catch (err) {
    tag = null;
  }
  try {
    posts = tag ? await getPosts({ status: "published", tagIds: [tag.id] }) : [];
  } catch (err) {
    posts = [];
  }
  return (
    <div className="container mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">Sector: {sector}</h1>
      <p className="text-muted-foreground mb-6">Reportes relacionados.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!tag ? (
          <p className="text-muted-foreground">No existe el sector solicitado.</p>
        ) : posts.length === 0 ? (
          <p className="text-muted-foreground">No hay reportes para este sector.</p>
        ) : (
          posts.map((p) => (
            <ReportCard
              key={p.id}
              title={p.title}
              sector={sector}
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
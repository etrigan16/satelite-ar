// Home / Landing B2B según especificaciones.
// Hero + Sectors + Featured Reports + Final CTA.
// Usa componentes estilo shadcn (Button, Card) y utilidades Tailwind.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectorCard } from "@/components/shared/sector-card";
import { ReportCard } from "@/components/shared/report-card";
import { getPosts } from "@/lib/api";

// Server Component: puede hacer fetch al backend directamente (SSR)
export default async function Home() {
  const sectors = [
    { slug: "agricultura", title: "Agricultura y Ganadería", description: "Optimice cosechas, monitoree sequías y gestione recursos." },
    { slug: "energia", title: "Energía", description: "Monitoreo de infraestructura y riesgos ambientales." },
    { slug: "logistica", title: "Logística", description: "Rutas, puertos y cadenas de suministro optimizadas." },
  ];
  // Obtiene últimos análisis desde el backend (Nest.js + Prisma)
  // Buenas prácticas: limitar resultados y ordenar por fecha del evento
  let latestPosts: Awaited<ReturnType<typeof getPosts>> = [];
  try {
    const posts = await getPosts({ status: "published" });
    latestPosts = posts
      .slice() // copia defensiva
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      .slice(0, 6); // máximo 6 tarjetas
  } catch (e) {
    // Fallback silencioso en caso de error del backend; mostramos mensaje en la UI
    latestPosts = [];
  }

  // Helper para crear un resumen breve desde el contenido
  // Buenas prácticas: evitar cortar palabras, limitar a ~160 caracteres
  const makeSummary = (text?: string) => {
    if (!text) return undefined;
    const max = 160;
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return `${cut.slice(0, lastSpace > 0 ? lastSpace : max)}…`;
  };

  return (
    <div className="container mx-auto max-w-6xl px-6 py-10">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Inteligencia Satelital para Decisiones Estratégicas en Argentina</h1>
        <p className="text-muted-foreground mb-6">
          Traducimos datos complejos de NASA en reportes accionables para su sector.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/reportes"><Button className="px-6" size="lg">Ver Reportes</Button></Link>
          <Link href="/contacto"><Button variant="outline" className="px-6" size="lg">Solicitar Consulta</Button></Link>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Soluciones por Sector</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((s) => (
            <SectorCard key={s.slug} name={s.title} description={s.description} slug={s.slug} />
          ))}
        </div>
      </section>

      {/* Featured Reports (Últimos análisis desde API) */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Nuestros Últimos Análisis</h2>
        {latestPosts.length === 0 ? (
          // Mensaje amigable si no hay datos o el backend falló
          <p className="text-sm text-muted-foreground">No hay análisis disponibles por el momento. Intente más tarde.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((p) => (
              <ReportCard
                key={p.slug}
                title={p.title}
                // Resumen truncado derivado de content (opcional)
                summary={makeSummary(p.content)}
                // Usamos el primer tag como sector visible
                sector={p.tags?.[0]?.name}
                slug={p.slug}
                // Mostramos nombres de tags; se devuelven desde el backend
                tags={(p.tags ?? []).map((t) => t.name)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Final CTA */}
      <section className="text-center border rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">¿Listo para potenciar su negocio con datos?</h2>
        <Link href="/contacto">
          <Button size="lg" className="px-6">Hable con un Experto</Button>
        </Link>
      </section>
    </div>
  );
}

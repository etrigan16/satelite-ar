// Home / Landing B2B según especificaciones.
// Hero + Sectors + Featured Reports + Final CTA.
// Usa componentes estilo shadcn (Button, Card) y utilidades Tailwind.
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectorCard } from "@/components/shared/sector-card";
import { ReportCard } from "@/components/shared/report-card";

export default function Home() {
  const sectors = [
    { slug: "agricultura", title: "Agricultura y Ganadería", description: "Optimice cosechas, monitoree sequías y gestione recursos." },
    { slug: "energia", title: "Energía", description: "Monitoreo de infraestructura y riesgos ambientales." },
    { slug: "logistica", title: "Logística", description: "Rutas, puertos y cadenas de suministro optimizadas." },
  ];

  const featuredReports = [
    { slug: "sequias-pampa-2025", title: "Impacto de la Sequía en la Pampa Húmeda: Análisis de Julio 2025", sector: "Agricultura", publishedAt: "10 Nov 2025" },
    { slug: "incendios-patagonia-2025", title: "Incendios en Patagonia: evaluación de impacto y respuesta", sector: "Ambiente", publishedAt: "08 Nov 2025" },
    { slug: "hidricos-cuyo-2025", title: "Gestión de recursos hídricos en Cuyo: tendencias 2025", sector: "Energía", publishedAt: "01 Nov 2025" },
  ];

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

      {/* Featured Reports */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Nuestros Últimos Análisis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredReports.map((r) => (
            <ReportCard
              key={r.slug}
              title={r.title}
              summary={undefined}
              sector={r.sector}
              slug={r.slug}
              tags={["Destacado"]}
            />
          ))}
        </div>
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

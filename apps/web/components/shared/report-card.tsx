"use client";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Componente compartido ReportCard
// Propósito: mostrar un resumen corto de un reporte B2B con título, sector, badges y CTA.
// Buenas prácticas: evitar texto largo en el card, usar enlaces seguros, y mantener accesibilidad.
// Seguridad: el slug y los textos deben provenir de fuentes confiables (sanitización en backend).
// Uso: <ReportCard title="Incendios Patagonia 2025" sector="Agricultura" slug="incendios-patagonia-2025" />

export type ReportCardProps = {
  title: string;
  summary?: string;
  sector?: string;
  slug: string; // identificador para la ruta dinámica
  tags?: string[];
};

export function ReportCard({ title, summary, sector, slug, tags = [] }: ReportCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        {/* Título del reporte */}
        <CardTitle className="text-lg font-semibold tracking-tight">
          <Link href={`/reportes/${slug}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Sector y etiquetas */}
        <div className="flex flex-wrap items-center gap-2">
          {sector ? <Badge variant="outline">{sector}</Badge> : null}
          {tags.map((t) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>

        {/* Resumen breve */}
        {summary ? (
          <p className="text-sm text-muted-foreground leading-snug">{summary}</p>
        ) : null}

        {/* Llamado a la acción */}
        <div className="pt-1">
          <Button asChild size="sm" variant="default">
            <Link href={`/reportes/${slug}`}>Ver análisis</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ReportCard;
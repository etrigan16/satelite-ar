"use client";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Componente compartido SectorCard
// Propósito: presentar un sector (vertical B2B) y enlazar a su listado de reportes.
// Buenas prácticas: textos claros, CTA visible, y semántica accesible.
// Seguridad: el nombre del sector se usa en la ruta; debe validarse/normalizarse en el backend.
// Uso: <SectorCard name="Agricultura" description="Impacto satelital en cultivos" slug="agricultura" />

export type SectorCardProps = {
  name: string;
  description?: string;
  slug: string; // segmento de ruta: `/sectores/${slug}`
};

export function SectorCard({ name, description, slug }: SectorCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">
          <Link href={`/sectores/${slug}`} className="hover:underline">
            {name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {description ? (
          <p className="text-sm text-muted-foreground leading-snug">{description}</p>
        ) : null}
        <div className="pt-1">
          <Button asChild size="sm" variant="outline">
            <Link href={`/sectores/${slug}`}>Ver reportes</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default SectorCard;
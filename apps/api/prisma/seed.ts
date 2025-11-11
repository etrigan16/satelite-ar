/**
 * Script de seed inicial para poblar Tags y Posts.
 *
 * Propósito:
 * - Crear un conjunto mínimo de Tags (sectores temáticos) y Posts publicados.
 * - Mantener idempotencia con `upsert` sobre `slug` para evitar duplicados.
 * - Facilitar validación visual en frontend y endpoints en backend.
 *
 * Seguridad y buenas prácticas:
 * - No se exponen secretos; se usa `DATABASE_URL` del entorno.
 * - Upsert por campos únicos (`slug`) evita creación repetida.
 * - Se usan transacciones para consistencia entre Tags y Posts.
 */

import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Tags base: sectores alineados a contenido satelital
  const tagsData = [
    // Usamos nombres en español, manteniendo slugs en inglés para estabilidad y SEO
    { name: "Agricultura", slug: "agriculture" },
    { name: "Ambiente", slug: "environment" },
    { name: "Defensa", slug: "defense" },
    { name: "Clima", slug: "climate" },
    { name: "Respuesta a Desastres", slug: "disaster-response" },
  ];

  // Upsert de Tags para idempotencia
  const tags = await Promise.all(
    tagsData.map((t) =>
      prisma.tag.upsert({
        where: { slug: t.slug },
        update: { name: t.name },
        create: { name: t.name, slug: t.slug },
      })
    )
  );

  // Helper para obtener IDs por slug rápidamente
  const getTagId = (slug: string) => tags.find((t) => t.slug === slug)?.id;

  // Posts base: publicados y vinculados a tags, con slugs únicos
  const postsData = [
    {
      title: "Patrones de sequía en la Pampa Argentina (2024)",
      slug: "drought-patterns-argentine-pampas-2024",
      status: Status.PUBLISHED,
      eventDate: new Date("2024-11-01"),
      content:
        "Análisis de patrones de sequía en la Pampa Argentina utilizando series temporales NDVI satelitales (2020–2024). Incluye detección de anomalías e impactos sectoriales.",
      tagSlugs: ["agriculture", "climate"],
    },
    {
      title: "Monitoreo de deforestación en el Chaco - Q3",
      slug: "chaco-deforestation-monitoring-q3",
      status: Status.PUBLISHED,
      eventDate: new Date("2024-09-30"),
      content:
        "Informe trimestral sobre focos de deforestación en la región del Gran Chaco usando datos satelitales SAR y ópticos. Se destacan oportunidades de control y cumplimiento.",
      tagSlugs: ["environment", "defense"],
    },
    {
      title: "Mapeo de riesgo de inundaciones en el Litoral",
      slug: "flood-risk-mapping-litoral",
      status: Status.PUBLISHED,
      eventDate: new Date("2025-01-15"),
      content:
        "Evaluación del riesgo de inundación para provincias del Litoral empleando modelos de elevación (DEM) y pronósticos de precipitación, con recomendaciones de respuesta a desastres.",
      tagSlugs: ["disaster-response", "climate"],
    },
  ];

  // Transacción para crear/actualizar posts y conectar tags
  await prisma.$transaction(
    postsData.map((p) =>
      prisma.post.upsert({
        where: { slug: p.slug },
        update: {
          title: p.title,
          status: p.status,
          eventDate: p.eventDate,
          content: p.content,
          // Reemplaza relaciones de tags por las actuales
          tags: {
            set: [],
            connect: p.tagSlugs
              .map((s) => ({ id: getTagId(s)! }))
              .filter((x) => !!x),
          },
        },
        create: {
          title: p.title,
          slug: p.slug,
          status: p.status,
          eventDate: p.eventDate,
          content: p.content,
          tags: {
            connect: p.tagSlugs
              .map((s) => ({ id: getTagId(s)! }))
              .filter((x) => !!x),
          },
        },
      })
    )
  );

  // Comentario educativo: en muchos-a-muchos, Prisma crea/usa la tabla intermedia automáticamente.
  // Las operaciones `connect` se basan en claves únicas (en este caso `id`).

  console.log("Seed completed: tags and posts upserted.");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
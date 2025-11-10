// Página de listado de Tags
// Muestra todas las etiquetas disponibles en el sistema

import { getTags } from "../../lib/api";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <main className="container mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Tags</h1>
      {tags.length === 0 ? (
        <p className="text-sm text-gray-500">No hay tags creados.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <li key={t.id} className="text-sm bg-gray-100 border rounded px-2 py-1">#{t.name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
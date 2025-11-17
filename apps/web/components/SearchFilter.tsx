"use client";
// Barra de búsqueda y filtros para Posts
// Implementada como Client Component para manejar interacción sin recargar totalmente

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Tag } from "../lib/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

type Props = {
  tags: Tag[];
};

export default function SearchFilter({ tags }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [status, setStatus] = useState<string>(searchParams.get("status") || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(() => (searchParams.get("tagIds") || "").split(",").filter(Boolean));
  // Nota: evitemos setState dentro de useEffect para cumplir linter.
  // Los valores iniciales ya derivan de searchParams en el primer render;
  // las actualizaciones se realizan al aplicar/limpiar filtros.

  function toggleTag(id: string) {
    setSelectedTags((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  function applyFilters() {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (selectedTags.length > 0) params.set("tagIds", selectedTags.join(","));
    router.push(`/posts?${params.toString()}`);
  }

  function resetFilters() {
    setSearch("");
    setStatus("");
    setSelectedTags([]);
    router.push(`/posts`);
  }

  return (
    <div className="rounded border p-3 mb-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          placeholder="Buscar (título o contenido)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="border rounded px-2 py-1 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Estado</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <Button onClick={applyFilters}>Aplicar</Button>
        <Button variant="outline" onClick={resetFilters}>Limpiar</Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t) => {
          const active = selectedTags.includes(t.id);
          return (
            <button
              key={t.id}
              onClick={() => toggleTag(t.id)}
              className={`text-xs border rounded px-2 py-1 ${active ? "bg-blue-600 text-white" : "bg-gray-100"}`}
              title={t.name}
            >
              #{t.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
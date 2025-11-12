"use client";
import { useState } from "react";
import { fetchNasaApod } from "@/lib/api";

/**
 * Página de ejemplo: /admin/apod
 * - Consume el proxy interno `/admin/api/nasa/apod` para obtener APOD.
 * - Permite elegir fecha (YYYY-MM-DD) y muestra imagen/video y descripción.
 * - Requiere sesión admin por middleware (/admin); el proxy ya inyecta x-admin-token servidor-side.
 */
export default function AdminApodPage() {
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  async function loadApod() {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const apod = await fetchNasaApod(date || undefined);
      setData(apod);
    } catch (err: any) {
      setError(err?.message || "Error al cargar APOD");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold">NASA APOD (Admin)</h1>
      <p className="text-sm text-muted-foreground mt-1">
        Astronomy Picture of the Day. Usa el proxy backend para ocultar la clave.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <label className="text-sm" htmlFor="date">Fecha (YYYY-MM-DD)</label>
        <input
          id="date"
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="2024-10-01"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={loadApod}
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Ver APOD"}
        </button>
      </div>

      {error && (
        <div className="mt-4 text-red-600">{error}</div>
      )}

      {data && (
        <div className="mt-6 space-y-3">
          <h2 className="text-xl font-medium">{data.title}</h2>
          <p className="text-sm text-muted-foreground">{data.date}</p>
          <div className="mt-3">
            {data.mediaType === "image" ? (
              <img src={data.hdUrl || data.url} alt={data.title} className="max-w-full rounded" />
            ) : (
              // Si es video (ej. YouTube/Vimeo), embebemos el iframe
              <iframe
                src={data.url}
                className="w-full aspect-video rounded"
                allowFullScreen
              />
            )}
          </div>
          <p className="mt-3 leading-relaxed whitespace-pre-wrap">{data.explanation}</p>
        </div>
      )}
    </div>
  );
}
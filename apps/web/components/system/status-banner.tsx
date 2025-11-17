"use client";
// Banner de estado del backend (API/DB)
// Propósito: mostrar un aviso global cuando el backend no responde
// Implementación: consulta periódicamente /api/health y muestra el banner si ok === false
import { useEffect, useState } from "react";

type Health = { ok: boolean; source: string; error?: string; db?: { ok: boolean; error?: string } } | null;

export default function StatusBanner() {
  const [health, setHealth] = useState<Health>(null);

  async function checkHealth() {
    try {
      const res = await fetch("/api/health", { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean; source: string; error?: string; db?: { ok: boolean; error?: string } };
      setHealth(data);
    } catch {
      setHealth({ ok: false, source: "api", error: "network error" });
    }
  }

  useEffect(() => {
    // Polling cada 10s para reconectar automáticamente
    const id = setInterval(checkHealth, 10000);
    return () => clearInterval(id);
  }, []);

  // Mostrar banner sólo si hay fallo
  const show = health && health.ok === false;
  if (!show) return null;

  return (
    <div className="w-full bg-red-600 text-white text-sm px-4 py-2">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div>
          <p>
            Servicio de backend no disponible. Algunas funciones pueden estar limitadas. Intentando reconectar…
          </p>
          {health?.db && health.db.ok === false && (
            <p className="opacity-90 text-xs">Base de datos: {health.db.error || 'no disponible'}</p>
          )}
        </div>
        {(health?.error || health?.db?.error) && (
          <span className="opacity-80 text-xs">({health.error || health.db?.error})</span>
        )}
      </div>
    </div>
  );
}
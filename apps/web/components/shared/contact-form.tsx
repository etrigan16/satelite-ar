"use client";
// Formulario de contacto básico (SSR friendly) con Input y Button.
// En producción, este form enviará a una ruta del backend (Nest.js) o App Router API.
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Integrar con backend (Nest.js) y validar datos.
      await new Promise((r) => setTimeout(r, 600));
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">Nombre</label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="email">Email</label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@empresa.com" required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="message">Mensaje</label>
        <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Contanos brevemente tu necesidad" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" rows={4} />
      </div>
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar"}</Button>
        {sent && <span className="text-sm text-green-600">¡Gracias! Te contactaremos pronto.</span>}
      </div>
    </form>
  );
}
// Navbar principal del sitio, enlaza a Home, Reportes, Sectores y Contacto.
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold">satelite.ar</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/reportes" className="hover:underline">Reportes</Link>
          <Link href="/sectores/agricultura" className="hover:underline">Sectores</Link>
          <Link href="/contacto" className="hover:underline">Contacto</Link>
        </nav>
      </div>
    </header>
  );
}
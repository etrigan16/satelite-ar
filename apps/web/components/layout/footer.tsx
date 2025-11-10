// Footer simple con información de proyecto.
export default function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto max-w-6xl px-6 py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} satelite.ar — Inteligencia Satelital.
      </div>
    </footer>
  );
}
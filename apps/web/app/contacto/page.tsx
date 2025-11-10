// Página de Contacto con un formulario simple.
import ContactForm from "@/components/shared/contact-form";

export default function ContactoPage() {
  return (
    <div className="container mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-3xl font-bold mb-4">Contacto</h1>
      <p className="text-muted-foreground mb-6">Contanos tu necesidad y te respondemos a la brevedad.</p>
      <ContactForm />
    </div>
  );
}
// Página de login de administrador. El redirect se maneja en el cliente.
// Seguridad: las credenciales se validan servidor-side y se setea cookie httpOnly.
import LoginForm from '@/components/admin/login-form';

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  // Determinar destino deseado de forma segura.
  const resolvedSearchParams = await searchParams;
  const nextRaw = resolvedSearchParams?.next ?? '/admin';
  const next = typeof nextRaw === 'string' && nextRaw.startsWith('/') ? nextRaw : '/admin';

  // Mostrar formulario cliente; este gestionará el redirect si ya hay sesión válida.
  return <LoginForm next={next} />;
}
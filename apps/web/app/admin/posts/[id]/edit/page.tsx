// Página de edición de Post (admin). Carga Post y Tags en servidor y renderiza formulario cliente.
// Buenas prácticas: manejar 404 si el Post no existe; no exponer secretos en el cliente.
import { notFound } from 'next/navigation';
import { getPostById, getTags } from '../../../../../lib/api';
import PostFormClient from '../../../../../components/admin/post-form';

type PageProps = { params: { id: string } };

export default async function EditPostPage({ params }: PageProps) {
  const id = params.id;
  // Cargar datos en el servidor para SSR. Manejar errores y 404 de forma segura.
  let post = null as Awaited<ReturnType<typeof getPostById>> | null;
  try {
    post = await getPostById(id);
  } catch {
    notFound();
  }
  if (!post) {
    notFound();
  }

  const tags = await getTags();

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Editar Post</h1>
      {/* Renderizamos formulario cliente en modo edición con valores iniciales */}
      <PostFormClient mode="edit" postId={id} initialPost={post} tags={tags} />
    </div>
  );
}

// Forzar datos frescos en modo SSR
export const dynamic = 'force-dynamic';
// Página de creación de Post (admin). Carga tags en servidor y renderiza formulario cliente.
import { getTags } from '../../../../lib/api';
import PostFormClient from '../../../../components/admin/post-form';

export default async function NewPostPage() {
  // Manejo defensivo: si el backend está caído, evitar que el SSR falle.
  // Mostramos el formulario sin tags y un aviso para el usuario admin.
  let tags: Awaited<ReturnType<typeof getTags>> = [];
  try {
    tags = await getTags();
  } catch {
    // En producción deberíamos observar logs; aquí mostramos un mensaje en la UI.
    tags = [];
  }
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Crear nuevo Post</h1>
      {tags.length === 0 && (
        <p className="text-sm text-amber-600 mb-3">
          Aviso: no se pudieron cargar las etiquetas (API no disponible). Podés crear el post y asignar tags más tarde.
        </p>
      )}
      <PostFormClient tags={tags} />
    </div>
  );
}
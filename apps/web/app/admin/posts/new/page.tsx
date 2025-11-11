// Página de creación de Post (admin). Carga tags en servidor y renderiza formulario cliente.
import { getTags } from '../../../../lib/api';
import PostFormClient from '../../../../components/admin/post-form';

export default async function NewPostPage() {
  const tags = await getTags();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Crear nuevo Post</h1>
      <PostFormClient tags={tags} />
    </div>
  );
}
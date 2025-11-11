// Dashboard simple de admin: acceso a crear post.
export default function AdminDashboard() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Panel de administración</h1>
      <p className="text-gray-600">Acciones rápidas:</p>
      <ul className="list-disc pl-6">
        <li><a className="text-blue-600 underline" href="/admin/posts/new">Crear nuevo Post</a></li>
      </ul>
    </div>
  );
}
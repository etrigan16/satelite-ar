// Formulario cliente para crear/editar Post.
// Comentarios educativos incluidos. En modo creación envía al proxy interno /admin/api/posts.
// En modo edición envía PATCH al proxy interno /admin/api/posts/[id].
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Tag, Post } from '../../lib/api';

type UiStatus = 'draft' | 'published';

export default function PostFormClient({
  tags,
  mode = 'create',
  postId,
  initialPost,
}: {
  tags: Tag[];
  mode?: 'create' | 'edit';
  postId?: string; // requerido en modo edición
  initialPost?: Post; // valores iniciales cuando se edita
}) {
  const router = useRouter();
  // Inicializar estado con valores del Post si estamos en edición
  const initialStatus: UiStatus = initialPost?.status
    ? (initialPost.status.toLowerCase() as UiStatus)
    : 'draft';
  const [title, setTitle] = useState(initialPost?.title ?? '');
  const [status, setStatus] = useState<UiStatus>(initialStatus);
  const [eventDate, setEventDate] = useState(
    initialPost?.eventDate ? new Date(initialPost.eventDate).toISOString().slice(0, 10) : ''
  );
  const [content, setContent] = useState(initialPost?.content ?? '');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialPost?.tags?.map((t) => t.id) ?? []
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const toggleTag = (id: string, checked: boolean) => {
    setSelectedTagIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!title || !eventDate || !content) {
      setMessage('Completa título, fecha y contenido.');
      return;
    }
    setLoading(true);
    try {
      const isoDate = new Date(eventDate).toISOString();
      // Convertimos el status a mayúsculas para alinear con el backend (DRAFT/PUBLISHED)
      const backendStatus = status.toUpperCase();
      const payload = { title, status: backendStatus, eventDate: isoDate, content, tagIds: selectedTagIds };
      const url = mode === 'edit' && postId ? `/admin/api/posts/${postId}` : '/admin/api/posts';
      const method = mode === 'edit' && postId ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(mode === 'edit' ? 'Post actualizado correctamente.' : 'Post creado correctamente.');
        // Redirigir al detalle del reporte si tenemos el slug
        const slug = (data?.slug ?? initialPost?.slug) as string | undefined;
        if (slug) {
          router.push(`/reportes/${slug}`);
          return;
        }
        // Si no hay slug, intentar redirigir al detalle por id (fallback)
        const id = (postId ?? data?.id) as string | undefined;
        if (id) {
          router.push(`/posts/${id}`);
          return;
        }
        // En última instancia, si no hay id/slug, limpiar el formulario en creación
        if (mode === 'create') {
          setTitle(''); setContent(''); setSelectedTagIds([]); setEventDate(''); setStatus('draft');
        }
      } else {
        setMessage(data?.message || data?.error || `Error: ${res.status}`);
      }
    } catch (err) {
      setMessage(mode === 'edit' ? 'Error de red al actualizar el post.' : 'Error de red al crear el post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input className="w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Estado</label>
        <select className="w-full border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="draft">Borrador</option>
          <option value="published">Publicado</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Fecha del evento</label>
        <input type="date" className="w-full border rounded px-3 py-2" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Contenido</label>
        <textarea className="w-full border rounded px-3 py-2 h-40" value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Tags</label>
        <div className="grid grid-cols-2 gap-2">
          {tags.map((t) => (
            <label key={t.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selectedTagIds.includes(t.id)} onChange={(e) => toggleTag(t.id, e.target.checked)} />
              {t.name}
            </label>
          ))}
        </div>
      </div>
      {message && <p className="text-sm {message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}">{message}</p>}
      <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">
        {loading ? (mode === 'edit' ? 'Actualizando…' : 'Creando…') : (mode === 'edit' ? 'Actualizar Post' : 'Crear Post')}
      </button>
    </form>
  );
}
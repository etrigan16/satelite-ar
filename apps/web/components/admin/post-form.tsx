// Formulario cliente para crear/editar Post.
// Comentarios educativos incluidos. En modo creación envía al proxy interno /admin/api/posts.
// En modo edición envía PATCH al proxy interno /admin/api/posts/[id].
"use client";
import { useState } from 'react';
// Importamos el cliente de NASA APOD (proxy admin) y el botón UI.
// Comentario: usamos el proxy interno /admin/api/nasa/apod, que inyecta token server-side.
import { fetchNasaApod, type ApodResponse } from '../../lib/api';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
// Corregimos origen de tipos: se importan desde lib/types (no desde lib/api)
import type { Tag, Post } from '../../lib/types';

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
  // Estado de carga exclusivo para el botón "Traer APOD".
  // Propósito: indicar al usuario que estamos obteniendo datos desde la NASA.
  const [isFetchingApod, setIsFetchingApod] = useState(false);
  // Vista previa de imagen/APOD: guardamos la mejor URL disponible (hdurl || url)
  const [apodPreviewUrl, setApodPreviewUrl] = useState<string | null>(null);
  // Helper simple para detectar si la URL parece de imagen
  const looksLikeImage = (u: string | null) => !!u && /\.(jpg|jpeg|png|gif|webp)$/i.test(u);

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
      // El backend espera 'draft' | 'published' (minúsculas) según contrato
      const payload = { title, status, eventDate: isoDate, content, tagIds: selectedTagIds };
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
    } catch {
      setMessage(mode === 'edit' ? 'Error de red al actualizar el post.' : 'Error de red al crear el post.');
    } finally {
      setLoading(false);
    }
  };

  // --- Lógica para traer datos de APOD ---
  // - Llama al endpoint interno /admin/api/nasa/apod
  // - Rellena los campos: title, content y eventDate
  // - Usa el estado isFetchingApod para mostrar feedback
  const handleFetchApod = async () => {
    setIsFetchingApod(true);
    setMessage(null);
    try {
      const apodData = (await fetchNasaApod()) as ApodResponse;
      // Rellenamos campos del formulario con la "magia"
      setTitle(apodData.title);
      setContent(apodData.explanation);
      // La fecha de APOD viene como YYYY-MM-DD; usamos ese string directamente
      setEventDate(apodData.date);
      // Guardamos la URL de imagen/video para previsualizar
      setApodPreviewUrl(apodData.hdurl || apodData.url);
      // Mensaje de confirmación
      setMessage('Datos de APOD cargados.');
    } catch (error: unknown) {
      // Tipado estricto del error para cumplir el linter y evitar any
      console.error('NASA APOD error:', error);
      const message = error instanceof Error ? error.message : 'Error inesperado';
      setMessage(`Error de NASA: ${message}`);
    } finally {
      setIsFetchingApod(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Encabezado de contenido y acción para traer APOD */}
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-lg font-semibold">Contenido del Reporte</h2>
        <Button
          type="button"
          variant="outline"
          onClick={handleFetchApod}
          disabled={isFetchingApod}
        >
          {isFetchingApod ? 'Cargando…' : 'Traer APOD'}
        </Button>
      </div>
      <div>
        <label className="block text-sm font-medium">Título</label>
        <input className="w-full border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Estado</label>
        <select
          className="w-full border rounded px-3 py-2"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
        >
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
      {/* Vista previa de la imagen APOD si está disponible */}
      <div>
        <label className="block text-sm font-medium">Imagen APOD</label>
        {apodPreviewUrl ? (
          looksLikeImage(apodPreviewUrl) ? (
            <Image
              src={apodPreviewUrl}
              alt="APOD preview"
              width={1024}
              height={768}
              className="mt-2 max-h-64 rounded border w-auto h-auto"
              unoptimized
            />
          ) : (
            <a
              href={apodPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm text-blue-600 hover:underline"
            >
              Ver recurso APOD (no es imagen)
            </a>
          )
        ) : (
          // Evitamos comillas sin escapar en JSX para cumplir el linter
          <p className="text-sm text-gray-500">Sin imagen cargada. Usá &quot;Traer APOD&quot; para previsualizar.</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium">Tags</label>
        <div className="grid grid-cols-2 gap-2">
          {tags.map((t: Tag) => (
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
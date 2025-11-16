"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * LoginForm: componente cliente para manejar ingreso de administrador.
 * - Envía usuario/contraseña al endpoint interno `/admin/api/login`.
 * - En éxito, redirige al `next` provisto desde el servidor.
 */
export default function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Si ya existe sesión válida, redirigir automáticamente sin mostrar el formulario.
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch('/admin/api/session', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && data?.authenticated) {
          const safeNext = next.startsWith('/admin/login') ? '/admin' : next;
          router.replace(safeNext);
        }
      } catch {
        // silencioso: si falla, se muestra el formulario normalmente
      }
    };
    check();
    return () => { cancelled = true; };
  }, [next, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/admin/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        let payload: unknown = {};
        try { payload = await res.json(); } catch { payload = {}; }
        const data = payload as { error?: string };
        throw new Error(data.error ?? 'Error de login');
      }
      router.push(next);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error inesperado';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Acceso administrador</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Usuario</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">Solo administradores autorizados.</p>
    </div>
  );
}
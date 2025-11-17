import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Post as PostType } from '@/lib/types'
import { getPosts } from '@/lib/api'

export default async function AdminPage() {
  let posts: PostType[] = []
  try {
    posts = await getPosts()
  } catch (e) {
    console.error('Error al obtener posts:', e)
    posts = []
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Link href="/admin/posts/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Nuevo Post
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestión de Posts</CardTitle>
          <p className="text-sm text-gray-500">Administrar todos los posts del blog</p>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay posts disponibles
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{post.title}</h3>
                        <Badge variant={(post.status as any)?.toString().toLowerCase() === 'published' ? 'default' : 'secondary'}>
                          {(post.status as any)?.toString().toLowerCase() === 'published' ? 'Publicado' : 'Borrador'}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {(post as PostType & { excerpt?: string }).excerpt ?? post.content.slice(0, 140)}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>
                          {format(new Date(post.createdAt), 'dd MMM yyyy', { locale: es })}
                        </span>
                        {post.tags.length > 0 && (
                          <div className="flex gap-1">
                            {post.tags.map((tag) => (
                              <Badge key={tag.id} variant="outline" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <form action={deletePostAction}>
                        <input type="hidden" name="postId" value={post.id} />
                        <Button type="submit" variant="destructive" size="sm">
                          Eliminar
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

async function deletePostAction(formData: FormData) {
  'use server'
  const postId = formData.get('postId') as string | null
  if (!postId) return
  const baseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
  try {
    const res = await fetch(`${baseUrl}/posts/${postId}`, { method: 'DELETE' })
    if (!res.ok) {
      throw new Error('Delete failed')
    }
  } catch (e) {
    console.error('Error deleting post:', e)
  }
  try {
    const { revalidatePath } = await import('next/cache')
    revalidatePath('/admin')
  } catch {}
}
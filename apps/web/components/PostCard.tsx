// Componente de tarjeta para mostrar un Post en listados
// Comentarios en español para orientar propósito y props

import Link from "next/link";
import { Post } from "../lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

type Props = {
  post: Post;
};

export default function PostCard({ post }: Props) {
  // Formateo simple de fecha para lectura humana
  const eventDate = new Date(post.eventDate).toLocaleDateString();

  return (
    <Card className="hover:shadow-sm transition">
      <CardHeader>
        <CardTitle>
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
        </CardTitle>
        <p className="text-xs text-gray-500">{post.status} • {eventDate}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-800 line-clamp-3">{post.content}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags?.map((t) => (
            <Badge key={t.id}>#{t.name}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
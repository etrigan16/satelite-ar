// Tipos compartidos para el frontend
// Comentarios en español para facilitar comprensión del modelo

export type Tag = {
  id: string;
  name: string;
  slug: string;
};

export type PostStatus = "DRAFT" | "PUBLISHED";

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: PostStatus;
  eventDate: string; // ISO string desde API; se puede formatear en UI
  createdAt: string;
  updatedAt: string;
  tags: Tag[];
};
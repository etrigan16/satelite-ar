import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Servicio de Posts: encapsula lógica con Prisma
@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  // Utilidad simple para generar slug a partir de texto
  private toSlug(input: string) {
    return input
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async list(params: {
    status?: 'draft' | 'published';
    tagIds?: string[];
    search?: string;
  }) {
    const { status, tagIds, search } = params;
    return this.prisma.post.findMany({
      where: {
        ...(status
          ? { status: status.toUpperCase() as 'DRAFT' | 'PUBLISHED' }
          : {}),
        ...(tagIds && tagIds.length > 0
          ? { tags: { some: { id: { in: tagIds } } } }
          : {}),
        ...(search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: { tags: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.post.findUnique({
      where: { id },
      include: { tags: true },
    });
  }

  async create(data: {
    title: string;
    content: string;
    status?: 'draft' | 'published';
    eventDate: string;
    tagIds?: string[];
    sourceApiName?: string;
    sourceImageUrl?: string;
    sourceDataUrl?: string;
  }) {
    // Generar slug único con manejo de duplicados
    const baseSlug = this.toSlug(data.title);
    let slug = baseSlug;
    let counter = 1;
    
    // Verificar si el slug ya existe y generar uno único
    while (await this.prisma.post.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }
    
    return this.prisma.post.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        status: (data.status ?? 'draft').toUpperCase() as 'DRAFT' | 'PUBLISHED',
        eventDate: new Date(data.eventDate),
        sourceApiName: data.sourceApiName,
        sourceImageUrl: data.sourceImageUrl,
        sourceDataUrl: data.sourceDataUrl,
        ...(data.tagIds && data.tagIds.length > 0
          ? { tags: { connect: data.tagIds.map((id) => ({ id })) } }
          : {}),
      },
      include: { tags: true },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      content?: string;
      status?: 'draft' | 'published';
      eventDate?: string;
      tagIds?: string[];
      sourceApiName?: string;
      sourceImageUrl?: string;
      sourceDataUrl?: string;
    },
  ) {
    // Si cambia el título, recalculamos slug y verificamos duplicados
    let slug: string | undefined = undefined;
    if (data.title) {
      const baseSlug = this.toSlug(data.title);
      slug = baseSlug;
      let counter = 1;
      
      // Verificar si el slug ya existe (excluyendo el post actual)
      while (await this.prisma.post.findFirst({ 
        where: { 
          slug,
          NOT: { id }
        } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        ...(data.title ? { title: data.title } : {}),
        ...(slug ? { slug } : {}),
        ...(data.content ? { content: data.content } : {}),
        ...(data.status
          ? { status: data.status.toUpperCase() as 'DRAFT' | 'PUBLISHED' }
          : {}),
        ...(data.eventDate ? { eventDate: new Date(data.eventDate) } : {}),
        ...(data.sourceApiName ? { sourceApiName: data.sourceApiName } : {}),
        ...(data.sourceImageUrl ? { sourceImageUrl: data.sourceImageUrl } : {}),
        ...(data.sourceDataUrl ? { sourceDataUrl: data.sourceDataUrl } : {}),
        ...(data.tagIds
          ? {
              // estrategia simple: desconectar todos y conectar los enviados
              tags: {
                set: [],
                connect: data.tagIds.map((id) => ({ id })),
              },
            }
          : {}),
      },
      include: { tags: true },
    });
  }

  async remove(id: string) {
    await this.prisma.post.delete({ where: { id } });
  }
}

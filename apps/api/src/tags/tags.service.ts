import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tag } from '@prisma/client';

// Servicio de Tags: CRUD básico y utilidades de slug
@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

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

  async list(): Promise<Tag[]> {
    try {
      return await this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
    } catch (err: unknown) {
      // Fallback de desarrollo: si la DB no está disponible, devolvemos una lista estática
      // para permitir que el frontend siga funcionando y validando integraciones.
      // En producción mantenemos fail-fast.
      if (process.env.NODE_ENV !== 'production') {
        return [
          { id: 'dev-agriculture', name: 'Agricultura', slug: 'agriculture' },
          { id: 'dev-environment', name: 'Ambiente', slug: 'environment' },
          { id: 'dev-defense', name: 'Defensa', slug: 'defense' },
          { id: 'dev-climate', name: 'Clima', slug: 'climate' },
          {
            id: 'dev-disaster-response',
            name: 'Respuesta a Desastres',
            slug: 'disaster-response',
          },
        ] as Tag[];
      }
      throw err;
    }
  }

  async findById(id: string) {
    return this.prisma.tag.findUnique({ where: { id } });
  }

  async create(data: { name: string }) {
    const slug = this.toSlug(data.name);
    return this.prisma.tag.create({ data: { name: data.name, slug } });
  }

  async update(id: string, data: { name?: string }) {
    const slug = data.name ? this.toSlug(data.name) : undefined;
    return this.prisma.tag.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(slug ? { slug } : {}),
      },
    });
  }

  async remove(id: string) {
    await this.prisma.tag.delete({ where: { id } });
  }
}

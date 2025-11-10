import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

// Servicio de Tags: CRUD básico y utilidades de slug
@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  private toSlug(input: string) {
    return input
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  async list() {
    return this.prisma.tag.findMany({ orderBy: { name: "asc" } });
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
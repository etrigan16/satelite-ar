// Pruebas unitarias para PostsService
// Objetivo: validar la lógica de negocio sin acceder a la DB,
// mockeando PrismaService y verificando transformación de datos (slug, status, fechas, tags).

import { PostsService } from './posts.service';

// Mock mínimo de PrismaService utilizado por PostsService
const createMockPrisma = () => ({
  post: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

describe('PostsService', () => {
  let service: PostsService;
  let prisma: ReturnType<typeof createMockPrisma>;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new PostsService(prisma as any);
  });

  it('create: genera slug y usa status por defecto DRAFT', async () => {
    prisma.post.create.mockResolvedValue({ id: 'p1' });
    const dto = {
      title: 'Hola Ñandú NASA 2024',
      content: 'Contenido',
      eventDate: '2024-01-02T03:04:05Z',
    };
    await service.create(dto);

    expect(prisma.post.create).toHaveBeenCalled();
    const arg = prisma.post.create.mock.calls[0][0];
    expect(arg.data.slug).toBe('hola-nandu-nasa-2024');
    expect(arg.data.status).toBe('DRAFT');
    expect(arg.data.eventDate instanceof Date).toBe(true);
  });

  it('create: respeta status PUBLISHED y conecta tags', async () => {
    prisma.post.create.mockResolvedValue({ id: 'p2' });
    const dto = {
      title: 'Título',
      content: 'Texto',
      status: 'published' as const,
      eventDate: '2024-05-06T07:08:09Z',
      tagIds: ['t1', 't2'],
    };
    await service.create(dto);

    const arg = prisma.post.create.mock.calls[0][0];
    expect(arg.data.status).toBe('PUBLISHED');
    expect(arg.data.tags.connect).toEqual([{ id: 't1' }, { id: 't2' }]);
  });

  it('update: recalcula slug si cambia title y sincroniza tags', async () => {
    prisma.post.update.mockResolvedValue({ id: 'p1' });
    await service.update('p1', {
      title: 'Nuevo título con acentos ÁÉÍ',
      tagIds: ['t3'],
    });

    const arg = prisma.post.update.mock.calls[0][0];
    expect(arg.data.slug).toBe('nuevo-titulo-con-acentos-aei');
    expect(arg.data.tags).toEqual({ set: [], connect: [{ id: 't3' }] });
  });

  it('list: construye filtros correctos para status, tags y search', async () => {
    prisma.post.findMany.mockResolvedValue([]);
    await service.list({ status: 'draft', tagIds: ['t1', 't2'], search: 'nasa' });

    const arg = prisma.post.findMany.mock.calls[0][0];
    expect(arg.where.status).toBe('DRAFT');
    expect(arg.where.tags.some.id.in).toEqual(['t1', 't2']);
    expect(arg.where.OR).toEqual([
      { title: { contains: 'nasa', mode: 'insensitive' } },
      { content: { contains: 'nasa', mode: 'insensitive' } },
    ]);
    expect(arg.include).toEqual({ tags: true });
  });

  it('findById: usa include {tags: true}', async () => {
    prisma.post.findUnique.mockResolvedValue({ id: 'p1' });
    await service.findById('p1');
    const arg = prisma.post.findUnique.mock.calls[0][0];
    expect(arg).toEqual({ where: { id: 'p1' }, include: { tags: true } });
  });

  it('remove: invoca delete con id', async () => {
    prisma.post.delete.mockResolvedValue({ id: 'p1' });
    await service.remove('p1');
    expect(prisma.post.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
  });
});
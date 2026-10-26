import { ConflictException, NotFoundException } from '@nestjs/common';
import { comparePassword } from '../common/password.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from './users.service.js';

describe('UsersService', () => {
  const create = vi.fn();
  const findUnique = vi.fn();
  const prisma = { user: { create, findUnique } } as unknown as PrismaService;
  const service = new UsersService(prisma);

  const dto = {
    name: 'Maria',
    email: 'maria@stockflow.com',
    password: 'senha-secreta',
  };

  beforeEach(() => {
    create.mockReset();
    findUnique.mockReset();
  });

  it('salva o hash da senha, não o texto puro', async () => {
    create.mockResolvedValue({ id: 'user-1' });

    await service.create(dto);

    const { data } = create.mock.calls[0][0];
    expect(data.password).not.toBe('senha-secreta');
    await expect(comparePassword('senha-secreta', data.password)).resolves.toBe(
      true,
    );
  });

  it('pede ao Prisma para omitir a senha nas respostas', async () => {
    create.mockResolvedValue({ id: 'user-1' });
    findUnique.mockResolvedValue({ id: 'user-1' });

    await service.create(dto);
    await service.findById('user-1');

    expect(create.mock.calls[0][0].omit).toEqual({ password: true });
    expect(findUnique.mock.calls[0][0].omit).toEqual({ password: true });
  });

  it('responde 409 quando o e-mail já existe', async () => {
    create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
  });

  it('responde 404 quando o usuário do token não existe mais', async () => {
    findUnique.mockResolvedValue(null);

    await expect(service.findById('user-apagado')).rejects.toThrow(
      NotFoundException,
    );
  });
});

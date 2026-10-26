import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from '../common/password.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  const jwt = new JwtService({ secret: 'segredo-de-teste' });
  const findUnique = vi.fn();
  const prisma = { user: { findUnique } } as unknown as PrismaService;
  const service = new AuthService(prisma, jwt);

  beforeEach(() => {
    findUnique.mockReset();
  });

  it('retorna um token com id, email e role quando as credenciais estão certas', async () => {
    findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'admin@stockflow.com',
      password: await hashPassword('senha-certa'),
      role: 'ADMIN',
    });

    const { accessToken } = await service.login(
      'admin@stockflow.com',
      'senha-certa',
    );

    expect(jwt.verify(accessToken)).toMatchObject({
      sub: 'user-1',
      email: 'admin@stockflow.com',
      role: 'ADMIN',
    });
  });

  it('recusa senha errada', async () => {
    findUnique.mockResolvedValue({
      id: 'user-1',
      email: 'admin@stockflow.com',
      password: await hashPassword('senha-certa'),
      role: 'ADMIN',
    });

    await expect(
      service.login('admin@stockflow.com', 'senha-errada'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('recusa e-mail inexistente', async () => {
    findUnique.mockResolvedValue(null);

    await expect(
      service.login('ninguem@stockflow.com', 'qualquer'),
    ).rejects.toThrow(UnauthorizedException);
  });
});

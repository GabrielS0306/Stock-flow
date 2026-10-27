import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Public } from '../decorators/public.decorator.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';

// Controller de mentira só para o guard ler os metadados do @Public()
class FakeController {
  protegida(this: void) {}

  @Public()
  publica(this: void) {}
}

function createContext(
  handler: () => void,
  request: Record<string, any>,
): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => FakeController,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('JwtAuthGuard', () => {
  const jwt = new JwtService({ secret: 'segredo-de-teste' });
  const guard = new JwtAuthGuard(jwt, new Reflector());
  const handlers = new FakeController();

  it('libera rotas marcadas com @Public() sem token', async () => {
    const context = createContext(handlers.publica, { headers: {} });

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it('recusa rota protegida sem token', async () => {
    const context = createContext(handlers.protegida, { headers: {} });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('recusa token assinado com outro segredo', async () => {
    const forged = await new JwtService({ secret: 'outro' }).signAsync({
      sub: 'user-1',
    });
    const context = createContext(handlers.protegida, {
      headers: { authorization: `Bearer ${forged}` },
    });

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('aceita token válido e coloca o payload em request.user', async () => {
    const token = await jwt.signAsync({
      sub: 'user-1',
      email: 'admin@stockflow.com',
      role: 'ADMIN',
    });
    const request = { headers: { authorization: `Bearer ${token}` } };

    await expect(
      guard.canActivate(createContext(handlers.protegida, request)),
    ).resolves.toBe(true);
    expect(request).toMatchObject({
      user: { sub: 'user-1', email: 'admin@stockflow.com', role: 'ADMIN' },
    });
  });
});

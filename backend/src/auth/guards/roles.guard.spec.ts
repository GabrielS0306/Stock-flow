import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../generated/prisma/client.js';
import { Roles } from '../decorators/roles.decorator.js';
import { RolesGuard } from './roles.guard.js';

// Controller de mentira só para o guard ler os metadados do @Roles()
class FakeController {
  livre(this: void) {}

  @Roles(Role.ADMIN)
  somenteAdmin(this: void) {}
}

function createContext(
  handler: () => void,
  user?: { role: Role },
): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => FakeController,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  const guard = new RolesGuard(new Reflector());
  const handlers = new FakeController();

  it('libera rota sem @Roles() para qualquer papel', () => {
    const context = createContext(handlers.livre, { role: Role.OPERATOR });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('libera ADMIN em rota @Roles(ADMIN)', () => {
    const context = createContext(handlers.somenteAdmin, { role: Role.ADMIN });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('barra OPERATOR em rota @Roles(ADMIN) com 403', () => {
    const context = createContext(handlers.somenteAdmin, {
      role: Role.OPERATOR,
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('barra quando não há usuário na requisição', () => {
    const context = createContext(handlers.somenteAdmin);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});

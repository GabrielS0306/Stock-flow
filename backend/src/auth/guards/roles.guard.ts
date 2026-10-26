import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Role } from '../../generated/prisma/client.js';
import type { AuthenticatedRequest } from '../authenticated-request.js';
import { ROLES_KEY } from '../decorators/roles.decorator.js';

// Roda depois do JwtAuthGuard, então request.user já está preenchido nas rotas protegidas.
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Rota sem @Roles(): qualquer usuário logado pode acessar
    if (!requiredRoles?.length) {
      return true;
    }

    const { user } = context
      .switchToHttp()
      .getRequest<Partial<AuthenticatedRequest>>();

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar este recurso',
      );
    }

    return true;
  }
}

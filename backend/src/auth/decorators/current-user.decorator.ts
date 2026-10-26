import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from '../authenticated-request.js';

// Injeta no parâmetro do controller o payload do token (preenchido pelo JwtAuthGuard).
// Uso: me(@CurrentUser() user: JwtPayload)
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().user,
);

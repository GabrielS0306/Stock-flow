import type { Role } from '../generated/prisma/client.js';

// Dados gravados dentro do token. "sub" (subject) é o nome padrão do JWT para o id do usuário.
export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}

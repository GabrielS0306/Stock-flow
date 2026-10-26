import type { Role } from '../../generated/prisma/client.js';

// As regras de validação (class-validator) entram na parte de validação dos DTOs.
export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

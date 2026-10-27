import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hashPassword } from '../common/password.js';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

// A senha já vem omitida de todas as consultas (configurado no PrismaService).
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        // Campos listados um a um: só entra no banco o que a API aceita
        data: {
          name: dto.name,
          email: dto.email,
          password: await hashPassword(dto.password),
          role: dto.role,
        },
      });
    } catch (error) {
      // P2002 = violação de campo único (o email tem @unique no schema)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Já existe um usuário com este e-mail');
      }
      throw error;
    }
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }
}

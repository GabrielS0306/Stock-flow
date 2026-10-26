import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePassword } from '../common/password.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { JwtPayload } from './jwt-payload.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Mesma mensagem para e-mail inexistente e senha errada:
    // assim a API não revela quais e-mails estão cadastrados.
    if (!user || !(await comparePassword(password, user.password))) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return { accessToken: await this.jwt.signAsync(payload) };
  }
}

import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import type { JwtPayload } from '../auth/jwt-payload.js';
import { Role } from '../generated/prisma/client.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Não existe cadastro público: só um ADMIN logado cria usuários
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // Qualquer usuário logado (sem @Roles), lendo o id de dentro do próprio token
  @Get('me')
  me(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user.sub);
  }
}

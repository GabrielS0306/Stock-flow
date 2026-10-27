import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Valida o corpo de todas as requisições com as regras dos DTOs.
    // whitelist: remove qualquer campo que não esteja declarado no DTO.
    // stopAtFirstError: no máximo uma mensagem de erro por campo.
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, stopAtFirstError: true }),
    },
  ],
})
export class AppModule {}

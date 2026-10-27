import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../generated/prisma/client.js';

// Campos omitidos de TODAS as consultas por padrão. Quem realmente precisa
// da senha (o login) pede de forma explícita com omit: { password: false }.
const GLOBAL_OMIT = { user: { password: true } } as const;

// Informar o omit no tipo faz o TypeScript também "esquecer" o campo:
// acessar user.password sem pedir explicitamente vira erro de compilação.
type PrismaOptions = Prisma.PrismaClientOptions & { omit: typeof GLOBAL_OMIT };

@Injectable()
export class PrismaService
  extends PrismaClient<PrismaOptions>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    // A aplicação usa o pooler do Supabase (DATABASE_URL).
    // A DIRECT_URL fica só no prisma.config.ts, para migrations.
    const adapter = new PrismaPg({
      connectionString: config.getOrThrow<string>('DATABASE_URL'),
    });
    super({ adapter, omit: GLOBAL_OMIT });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

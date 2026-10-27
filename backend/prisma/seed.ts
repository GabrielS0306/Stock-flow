import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from '../src/common/password.js';
import { PrismaClient, Role } from '../src/generated/prisma/client.js';

// Cria o primeiro ADMIN. Como não existe cadastro público,
// sem ele ninguém conseguiria logar para criar os outros usuários.

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável ${name} não definida no .env`);
  }
  return value;
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: requireEnv('DATABASE_URL') }),
});

async function main() {
  const name = requireEnv('ADMIN_NAME');
  const email = requireEnv('ADMIN_EMAIL');
  const password = requireEnv('ADMIN_PASSWORD');

  // upsert com update vazio: cria se não existir e não mexe se já existir.
  // Assim o seed pode rodar várias vezes sem duplicar nem sobrescrever a senha.
  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name,
      email,
      password: await hashPassword(password),
      role: Role.ADMIN,
    },
  });

  console.log(`ADMIN pronto: ${admin.email}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

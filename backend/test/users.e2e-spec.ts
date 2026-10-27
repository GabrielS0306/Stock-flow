import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { hashPassword } from './../src/common/password.js';
import { PrismaService } from './../src/prisma/prisma.service.js';

// Usa o banco do .env: os usuários são criados com um domínio próprio e apagados no final.
const TEST_DOMAIN = '@e2e.stockflow.dev';
const ADMIN = { email: `admin${TEST_DOMAIN}`, password: 'senha-do-admin' };

describe('Users (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);

    await prisma.user.create({
      data: {
        name: 'Admin E2E',
        email: ADMIN.email,
        password: await hashPassword(ADMIN.password),
        role: 'ADMIN',
      },
    });

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send(ADMIN)
      .expect(200);
    adminToken = login.body.accessToken;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: { email: { endsWith: TEST_DOMAIN } },
    });
    await app.close();
  });

  it('POST /auth/login devolve só o token', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(ADMIN)
      .expect(200);

    expect(Object.keys(response.body)).toEqual(['accessToken']);
  });

  it('POST /users não devolve a senha', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Operador E2E',
        email: `operador${TEST_DOMAIN}`,
        password: 'senha-do-operador',
      })
      .expect(201);

    expect(response.body).toMatchObject({ role: 'OPERATOR' });
    expect(response.body).not.toHaveProperty('password');
  });

  it('GET /users/me não devolve a senha', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body).toMatchObject({ email: ADMIN.email, role: 'ADMIN' });
    expect(response.body).not.toHaveProperty('password');
  });

  it('consultas comuns do PrismaService omitem a senha por padrão', async () => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: ADMIN.email },
    });

    expect(user).not.toHaveProperty('password');
  });
});

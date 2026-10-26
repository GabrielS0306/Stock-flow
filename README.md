# Stock Flow

Sistema de controle de estoque para pequenos comércios. Projeto de portfólio full stack, com API em NestJS e interface em React.

> 🚧 Em desenvolvimento.

## Funcionalidades

- [ ] Autenticação com JWT e controle de acesso por papel (`ADMIN` e `OPERATOR`)
- [ ] Gestão de usuários (somente administradores criam contas)
- [ ] Cadastro de produtos
- [ ] Entradas e saídas de estoque
- [ ] Dashboard com indicadores

## Tecnologias

**Backend** (`backend/`)
- [NestJS](https://nestjs.com/) com TypeScript em modo strict
- [Prisma 7](https://www.prisma.io/) com o driver adapter `@prisma/adapter-pg`
- PostgreSQL hospedado no [Supabase](https://supabase.com/)
- Vitest para testes e Oxlint para lint

**Frontend** (`frontend/`)
- [React](https://react.dev/) + [Vite](https://vite.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## Estrutura

```
stock-flow/
├── backend/            # API REST (NestJS)
│   ├── prisma/         # schema.prisma e migrations
│   └── src/
│       ├── generated/  # Prisma Client gerado (não versionado)
│       └── prisma/     # PrismaModule global
└── frontend/           # SPA (React)
    └── src/
        ├── components/ui/  # componentes do shadcn/ui
        ├── contexts/
        ├── hooks/
        ├── lib/
        ├── pages/
        ├── routes/
        └── services/   # chamadas à API
```

## Como rodar localmente

### Pré-requisitos

- Node.js 24 ou superior
- Um projeto no Supabase (ou outro PostgreSQL)

### Backend

```bash
cd backend
npm install
cp .env.example .env      # preencha com os dados do seu banco
npx prisma migrate dev    # aplica as migrations
npx prisma generate       # no Prisma 7, a geração do client é um passo separado
npm run start:dev
```

A API sobe em `http://localhost:3000`.

> Senhas com caracteres especiais (`@`, `:`, `/`, `#`...) precisam ser codificadas na URL de conexão. Exemplo: `@` vira `%40`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A aplicação abre em `http://localhost:5173`.

## Variáveis de ambiente

| Variável | Onde | Para que serve |
|---|---|---|
| `DATABASE_URL` | backend | Conexão da aplicação, pelo pooler do Supabase em modo transaction (porta 6543) |
| `DIRECT_URL` | backend | Conexão usada pelas migrations, pelo pooler em modo session (porta 5432) |
| `JWT_SECRET` | backend | Segredo que assina os tokens JWT |
| `VITE_API_URL` | frontend | URL base da API |

## Scripts úteis

| Comando | Pasta | Descrição |
|---|---|---|
| `npm run start:dev` | backend | API em modo watch |
| `npm test` | backend | Testes unitários |
| `npm run test:e2e` | backend | Testes end-to-end (usam o banco configurado) |
| `npm run lint` | backend / frontend | Lint |
| `npm run format` | backend | Formata o código com Prettier |
| `npm run dev` | frontend | Servidor de desenvolvimento |
| `npm run build` | frontend | Build de produção |

## Fluxo de branches

- `main`: versão estável
- `feature/estoque-mvp`: branch-mãe do MVP
- `feat/*`: uma branch por funcionalidade, com PR apontando para `feature/estoque-mvp`

Os commits seguem o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).

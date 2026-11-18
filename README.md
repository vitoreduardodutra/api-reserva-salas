# API de Reserva de Salas — Semanas 15 e 16

Projeto acadêmico simples desenvolvido com **Node.js, Express, Prisma e SQLite**.

## O que foi feito

- Estrutura inicial da API e configuração do ambiente.
- Banco SQLite configurado com Prisma.
- Modelos `User`, `Room` e `Reservation`, com seus relacionamentos.
- Migration inicial do banco de dados.
- Seed com um administrador e duas salas de exemplo.
- CRUD de salas: listar, consultar, cadastrar, atualizar e excluir.
- Listagem de salas com paginação.
- Validação de dados com Zod.
- Respostas de erro padronizadas em JSON.
- Senha armazenada com hash usando bcrypt.
- Login JWT simples para testar a proteção das rotas administrativas.
- Apenas administrador pode cadastrar, editar ou excluir salas.

**Observação:** as rotas e regras de reservas ainda não foram implementadas, pois ficam para as próximas semanas do cronograma. O modelo `Reservation` foi criado apenas para deixar os relacionamentos do banco preparados.

## Requisitos

- Node.js 20 ou superior.
- npm.

## Como executar

1. Abra a pasta do projeto no VS Code ou terminal.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Crie seu arquivo `.env` a partir do exemplo.

   No PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   No `.env`, confira os dados do administrador e altere `JWT_SECRET` para uma chave própria.

4. Gere o Prisma Client e crie o banco com a migration:

   ```bash
   npm run db:generate
   npm run db:migrate -- --name init
   ```

5. Crie o administrador inicial e as salas de exemplo:

   ```bash
   npm run db:seed
   ```

6. Inicie a API:

   ```bash
   npm run dev
   ```

A API ficará disponível em `http://localhost:3000`.

## Administrador inicial

Com as configurações padrão do `.env.example`:

- E-mail: `admin@salas.com`
- Senha: `Admin123!`

Esses dados são apenas para desenvolvimento e apresentação. Altere-os no arquivo `.env`.

## Rotas disponíveis

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| POST | `/api/register` | Público | Cadastrar usuário comum |
| POST | `/api/login` | Público | Entrar e receber JWT |
| GET | `/api/rooms?page=1&size=10` | Público | Listar salas com paginação |
| GET | `/api/rooms/:id` | Público | Consultar uma sala |
| POST | `/api/rooms` | Admin | Cadastrar sala |
| PUT | `/api/rooms/:id` | Admin | Atualizar sala |
| DELETE | `/api/rooms/:id` | Admin | Excluir sala |

Para as rotas administrativas, envie o cabeçalho:

```text
Authorization: Bearer SEU_TOKEN
```

Primeiro faça login em `POST /api/login` e copie o token retornado.

## Exemplos de requisição

### Cadastrar sala

```json
{
  "name": "Sala de Reunião",
  "capacity": 15,
  "location": "Bloco C"
}
```

### Exemplo de resposta de validação

```json
{
  "status": 422,
  "message": "Dados inválidos.",
  "errors": [
    {
      "field": "body.capacity",
      "message": "A capacidade deve ser um número inteiro maior que zero."
    }
  ]
}
```

Há exemplos prontos de chamadas no arquivo `examples/requisicoes.http` (extensão REST Client do VS Code).

## Estrutura de pastas

```text
api-reserva-salas/
├── examples/
│   └── requisicoes.http
├── prisma/
│   ├── migrations/
│   │   └── 20261117000000_init/
│   │       └── migration.sql
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/prisma.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validate.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── roomRoutes.js
│   ├── schemas/
│   │   ├── authSchemas.js
│   │   └── roomSchemas.js
│   ├── utils/
│   │   ├── asyncHandler.js
│   │   └── createToken.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
└── package.json
```

# API de Usuários

API REST para cadastro, listagem, edição e remoção de usuários — Node.js, Express e MySQL (RDS). Inclui scripts de criação de BD/tabela e integração com Prisma opcional.

## Pré-requisitos
- Node.js (>=16)
- npm
- Conta AWS (RDS) ou MySQL acessível
- (Opcional) Prisma se for usar migrations

## Estrutura principal
- server.js — rotas REST
- db.js — pool MySQL (mysql2)
- create-db.js — cria database no RDS via script Node
- create-table.js — cria tabela `users`
- test-db.js / show-rows.js — scripts de teste
- prisma/schema.prisma — (opcional) esquema Prisma

## Variáveis de ambiente (.env)
Não compartilhe este arquivo. Exemplo em `.env.example`.

Chaves usadas:
```
DB_HOST=your-rds-endpoint
DB_USER=your-db-user
DB_PASS=your-db-password
DB_NAME=your-db-name
DB_PORT=3306
PORT=3000

# Prisma (opcional)
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"
```

## Instalação
```bash
npm install
# se usar Prisma:
npm install -D prisma
npm install @prisma/client mysql2 dotenv
npx prisma generate
```

## Criar database / tabela (se necessário)
- Criar DB (via script Node, sem cliente MySQL):
```bash
node create-db.js
```
- Criar tabela `users`:
```bash
node create-table.js
```

## Executando a API
```bash
node --watch server.js
# ou
node server.js
```
A API ficará disponível em `http://localhost:3000`.

## Rotas principais
- GET /health
- GET /users
- GET /users/:id
- POST /users
  - Exemplo payload (JSON):
  ```json
  {
    "name": "Lucas",
    "birthDate": "15-08-2009",
    "cpf": "12345678901",
    "nickname": "lucasinho",
    "gender": "Masculino",
    "email": "lucas@example.com",
    "telephone": "11999999999",
    "state": "SP",
    "country": "Brasil"
  }
  ```
  - `birthDate` em formato `dd-MM-yyyy` (o servidor converte para ISO).
  - `gender` aceita: `Masculino`, `Feminino`, `Outros`.
  - `cpf` e `email` são únicos.
- PUT /users/:id
- DELETE /users/:id

## Testes rápidos
- Curl:
```bash
curl http://localhost:3000/health
curl http://localhost:3000/users
```
- Use Thunder Client / Postman para testar endpoints POST/PUT com `Content-Type: application/json`.

## Git / segurança
- Adicione `.env` no `.gitignore` (já configurado).
- Crie `.env.example` com placeholders para compartilhar configuração sem segredos.

## Prisma (opcional)
- Se usar Prisma com MySQL:
  - Ajuste `prisma/schema.prisma` com `provider = "mysql"`.
  - Execute:
  ```bash
  npx prisma generate
  npx prisma migrate dev --name init
  ```
  - Se usar MongoDB, altere datasource e adapte IDs.

## Troubleshooting
- Erro `Access denied` → verificar usuário/senha e Security Group do RDS (inbound 3306 para seu IP).
- Erro `Unknown database` → criar DB (`create-db.js`) ou corrigir `DB_NAME`.
- Erro `ER_DUP_ENTRY` → CPF/email duplicado.
- Ver logs do servidor (terminal) ao testar endpoints.

## Próximos passos recomendados
- Criar `.env.example`
- Testes automatizados (jest / supertest)
- Documentação OpenAPI / Postman collection
- Em produção: restringir Security Group, habilitar backups e monitoramento RDS

# api_node

# API de Usuários

Este projeto é uma API REST para cadastro, listagem, edição e remoção de usuários, construída com Node.js, Express e Prisma.

## Pré-requisitos

- Node.js
- npm
- Banco de dados configurado (ex: MongoDB Atlas ou PostgreSQL)
- Prisma configurado

## Instalação

```bash
npm install
npx prisma generate
```

## Configuração

1. Configure o arquivo `.env` com a string de conexão do seu banco de dados.
2. Ajuste o arquivo `prisma/schema.prisma` conforme seu banco.

## Executando o projeto

```bash
node --watch server.js
```

## Rotas

### Criar usuário

`POST /users`

```json
{
  "name": "lucas",
  "birthDate": "15-08-2009",
  "cpf": "12345678900",
  "nickname": "lucasinho",
  "gender": "Masculino",
  "email": "lucas@email.com",
  "telephone": "11999999999",
  "state": "SP",
  "country": "Brasil"
}
```

### Listar usuários

`GET /users`

### Editar usuário

`PUT /users/:id`

### Remover usuário

`DELETE /users/:id`

## Observações

- O campo `birthDate` deve ser enviado no formato `dd-MM-yyyy`.
- Os campos `cpf` e `email` devem ser únicos.
- O campo `gender` aceita apenas: `Masculino`, `Feminino` ou `Outros`.

---
```# API de Usuários

Este projeto é uma API REST para cadastro, listagem, edição e remoção de usuários, construída com Node.js, Express e Prisma.

## Pré-requisitos

- Node.js
- npm
- Banco de dados configurado (ex: MongoDB Atlas ou PostgreSQL)
- Prisma configurado

## Instalação

```bash
npm install
npx prisma generate
```

## Configuração

1. Configure o arquivo `.env` com a string de conexão do seu banco de dados.
2. Ajuste o arquivo `prisma/schema.prisma` conforme seu banco.

## Executando o projeto

```bash
node --watch server.js
```

## Rotas

### Criar usuário

`POST /users`

```json
{
  "name": "lucas",
  "birthDate": "15-08-2009",
  "cpf": "12345678900",
  "nickname": "lucasinho",
  "gender": "Masculino",
  "email": "lucas@email.com",
  "telephone": "11999999999",
  "state": "SP",
  "country": "Brasil"
}
```

### Listar usuários

`GET /users`

### Editar usuário

`PUT /users/:id`

### Remover usuário

`DELETE /users/:id`

## Observações

- O campo `birthDate` deve ser enviado no formato `dd-MM-yyyy`.
- Os campos `cpf` e `email` devem ser únicos.
- O campo `gender` aceita apenas: `Masculino`, `Feminino
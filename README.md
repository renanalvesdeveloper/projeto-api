# API de Cursos

API RESTful para gerenciamento de cursos, construída com Fastify, TypeScript, Drizzle ORM, Zod e PostgreSQL.

---

## Objetos Principais

### Curso (`Course`)

Representa um curso cadastrado no sistema.

| Campo       | Tipo          | Descrição                     |
| ----------- | ------------- | ----------------------------- |
| id          | string (UUID) | Identificador único do curso  |
| name        | string        | Nome do curso                 |
| description | string/null   | Descrição do curso (opcional) |

---

## Passos para rodar a aplicação

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- [npm](https://www.npmjs.com/) v9 ou superior
- [Docker](https://www.docker.com/) (opcional, recomendado para rodar o PostgreSQL)
- [PostgreSQL](https://www.postgresql.org/) (caso não use Docker)

---

### 2. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd <nome-da-pasta>
```

---

### 3. Instalar as dependências

```bash
npm install
```

---

### 4. Configurar o banco de dados

#### Usando Docker (recomendado)

Crie um arquivo `docker-compose.yml` na raiz do projeto com o seguinte conteúdo:

```yaml
services:
  db:
    image: postgres:17
    container_name: postgres17
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: desafio
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Suba o banco de dados:

```bash
docker compose up -d
```

#### Usando PostgreSQL local

Crie um banco chamado `desafio` e configure o usuário e senha conforme necessário.

---

### 5. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o conteúdo:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/desafio
NODE_ENV=development
```

---

### 6. Gerar e aplicar migrações

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

### 7. Rodar a aplicação

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000`.

---

### 8. Acessar a documentação Swagger

Acesse `http://localhost:3000/docs` para visualizar e testar os endpoints.

---

## Principais comandos npm

| Comando                    | Descrição                                 |
| -------------------------- | ----------------------------------------- |
| `npm run dev`              | Inicia o servidor em modo desenvolvimento |
| `npx drizzle-kit generate` | Gera as migrações com base no schema      |
| `npx drizzle-kit migrate`  | Aplica as migrações no banco              |
| `npx drizzle-kit studio`   | Abre o Drizzle Studio (GUI)               |

---

## Diagrama do fluxo principal da aplicação

```mermaid
flowchart TD
    A[Cliente faz requisição HTTP] --> B[Fastify recebe a requisição]
    B --> C[Validação dos dados com Zod]
    C --> D{Dados válidos?}
    D -- Não --> E[Retorna erro 400]
    D -- Sim --> F[Handler da rota]
    F --> G[Consulta/Gravação no PostgreSQL via Drizzle ORM]
    G --> H[Serialização da resposta com Zod]
    H --> I[Resposta HTTP enviada ao cliente]
```

---

## Observações

- O projeto utiliza validação e serialização automática com Zod.
- O Drizzle ORM facilita a manipulação do banco de dados com tipagem forte.
- O Swagger está disponível em `/docs` para facilitar testes e documentação.
- O código segue boas práticas de modularização e tipagem com TypeScript.

---

**Dúvidas?**  
Abra uma issue ou entre em contato com o mantenedor do projeto.

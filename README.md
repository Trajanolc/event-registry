# Event Registry

Protótipo para registro de eventos culturais via linguagem natural.

## Stack

| Camada | Tecnologia | Porta |
|--------|-----------|-------|
| Frontend | Next.js 15 | 3000 |
| Backend | Python / FastAPI | 8000 |
| Banco de dados | PostgreSQL 16 | 5432 |

## Como rodar

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) v2+

### 1. Clone o repositório

```bash
git clone <repo-url>
cd event_registry
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e preencha os valores obrigatórios:

| Variável | Descrição |
|----------|-----------|
| `OPENAI_API_KEY` | Chave da API OpenAI — [obtenha aqui](https://platform.openai.com/api-keys) |
| `LANGFUSE_PUBLIC_KEY` | Chave pública Langfuse — [obtenha aqui](https://cloud.langfuse.com) |
| `LANGFUSE_SECRET_KEY` | Chave secreta Langfuse |

> As variáveis `POSTGRES_USER`, `POSTGRES_PASSWORD` e `DATABASE_URL` já têm valores padrão e funcionam sem alteração.

### 3. Suba o ambiente

```bash
docker compose up --build
```

Aguarde todos os serviços iniciarem. O backend aguarda o PostgreSQL estar pronto antes de iniciar (healthcheck configurado).

### 4. Acesse

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Documentação da API:** http://localhost:8000/docs

## Comandos úteis

```bash
# Subir em background
docker compose up --build -d

# Ver logs de um serviço
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Parar tudo
docker compose down

# Parar e remover volumes (limpa o banco)
docker compose down -v
```

## Testes

Ainda não há testes automatizados configurados neste projeto. Testes manuais são feitos via a documentação interativa da API (Swagger) em `http://localhost:8000/docs`.

Para adicionar testes futuramente:

- **Backend (Python):** adicione `pytest` e `httpx` ao `backend/requirements.txt` e crie arquivos `test_*.py`
- **Frontend (Next.js):** adicione `jest` e `@testing-library/react` ao `frontend/package.json`

## Estrutura do projeto

```
event_registry/
├── backend/          # API Python/FastAPI
│   ├── Dockerfile
│   ├── main.py
│   └── requirements.txt
├── frontend/         # App Next.js
│   ├── Dockerfile
│   ├── app/
│   └── package.json
├── docs/             # Documentação e regras de negócio
├── docker-compose.yml
├── .env.example
└── README.md
```

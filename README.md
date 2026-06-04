# SIDIAM 2 - Plataforma de Diagnóstico em Matemática

SIDIAM é uma plataforma educacional para diagnóstico em matemática que auxilia professores na identificação de dificuldades de aprendizagem, acompanhamento de turmas, geração de insights pedagógicos e criação de registros detalhados de desempenho estudantil.

## 🎯 Objetivo

Implementar uma solução completa de gestão pedagógica com foco em diagnóstico matemático, suportando:
- Cadastro e gerenciamento de escolas, turmas e alunos
- Criação e aplicação de avaliações diagnósticas
- Registro de dificuldades e progressão acadêmica
- Geração de insights para ação pedagógica

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** com **Express.js** — servidor API REST
- **Knex.js** — migrations e query builder
- **PostgreSQL** — banco de dados relacional principal
- **MongoDB** — armazenamento de dados complementares (assessments)
- **JWT + bcryptjs** — autenticação e segurança

### Frontend
- **React 18** — library de UI
- **Vite** — build tool e dev server
- **Componentes customizados** — interface responsiva

### Infraestrutura
- **Docker & Docker Compose** — containerização e orquestração
- **Node.js 18+** — runtime environment

## 📋 Requisitos

- **Node.js** 18+ ou **Docker** 20.10+
- **npm** 9+ (incluído no Node.js)
- **Git** para controle de versão

## 🚀 Início Rápido

### 1. Com Docker (Recomendado)

```bash
# Clone ou baixe o projeto
cd SIDIAM\ 2

# Inicie os serviços (PostgreSQL + MongoDB)
docker-compose up -d

# Instale as dependências
npm install

# Rode as migrações do banco
npx knex migrate:latest

# Carregue dados de teste (opcional)
node seed_test_data.js

# Inicie backend e frontend simultaneamente
npm run dev
```

**Backend**: http://localhost:3000  
**Frontend**: http://localhost:5173

### 2. Instalação Local (sem Docker)

```bash
# Instale PostgreSQL 15 e MongoDB 6 localmente
# Configure variáveis de ambiente no arquivo .env

npm install
npx knex migrate:latest
node seed_test_data.js

# Terminal 1: Backend
npm run start:backend

# Terminal 2: Frontend
npm run start:frontend
```

## 📁 Estrutura do Projeto

```
SIDIAM 2/
├── docs/
│   ├── ADR-001-especificacao-tecnica.md      # Decisões arquiteturais
│   └── MVP-001-visao-e-requisitos.md         # Visão do produto
├── src/
│   ├── backend/
│   │   ├── index.js                          # Entrada principal
│   │   ├── db.js                             # Conexão PostgreSQL
│   │   ├── db_mongo.js                       # Conexão MongoDB
│   │   ├── models.js                         # Definição de modelos
│   │   ├── migrations/                       # Migrações de banco
│   │   └── tests/                            # Testes backend
│   └── frontend/
│       ├── src/
│       │   ├── App.jsx                       # Componente raiz
│       │   ├── main.jsx                      # Entrada Vite
│       │   ├── pages/                        # Páginas da aplicação
│       │   ├── components/                   # Componentes reutilizáveis
│       │   └── App.css                       # Estilos globais
│       ├── index.html                        # HTML principal
│       ├── vite.config.js                    # Configuração Vite
│       └── package.json                      # Deps do frontend
├── docker-compose.yml                        # Orquestração de containers
├── knexfile.js                               # Configuração de migrações
├── package.json                              # Dependências principais
├── seed_test_data.js                         # Dados de teste
└── PROJECT-START.md                          # Plano de desenvolvimento
```

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# PostgreSQL
DB_HOST=localhost
DB_USER=sidiam_user
DB_PASSWORD=sidiam_password
DB_NAME=sidiam_db
DB_PORT=5432

# MongoDB
MONGO_URI=mongodb://admin:admin_password@localhost:27017/sidiam

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Server
PORT=3000
NODE_ENV=development
```

## 📚 Páginas e Funcionalidades

| Página | Descrição |
|--------|-----------|
| **Login** | Autenticação de usuários (professores/admin) |
| **Home** | Dashboard principal |
| **Escolas** | Cadastro e gerenciamento de instituições |
| **Turmas** | Criação e configuração de classes |
| **Alunos** | Registro e perfil de estudantes |
| **Avaliações** | Criação e aplicação de diagnósticos |
| **Questões** | Banco de questões de matemática |
| **Registros Pedagógicos** | Acompanhamento individual |
| **Usuários** | Gerenciamento de acesso |

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes com cobertura
npm test -- --coverage
```

Os testes usam **Jest** e **Supertest** para API testing.

## 📊 Modelo de Dados

### Entidades Principais
- **Users** — Professores, administradores
- **Schools** — Instituições educacionais
- **Classes** — Turmas
- **Students** — Alunos
- **Assessments** — Avaliações diagnósticas
- **Questions** — Questões de matemática
- **PedagogicalRecords** — Registros de acompanhamento

## 📖 Documentação Adicional

- [Visão do Produto](docs/MVP-001-visao-e-requisitos.md) — Requisitos funcionais e não-funcionais
- [Especificação Técnica](docs/ADR-001-especificacao-tecnica.md) — Decisões arquiteturais
- [Plano Inicial](PROJECT-START.md) — Roadmap de desenvolvimento

## 🔄 Fluxo de Desenvolvimento

1. **Feature branch** — Crie uma branch: `git checkout -b feature/nome-feature`
2. **Desenvolvimento** — Implemente e teste
3. **Migrações** — Se alterar schema: `npx knex migrate:make nome_migracao`
4. **Testes** — Execute `npm test`
5. **Pull Request** — Submeta para revisão

## 🐳 Comandos Docker Úteis

```bash
# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f db_postgres
docker-compose logs -f db_mongo

# Parar containers
docker-compose down

# Remover volumes (limpa dados)
docker-compose down -v
```

## 🤝 Contribuindo

1. Faça fork ou clone o repositório
2. Instale dependências: `npm install`
3. Crie feature branch: `git checkout -b feature/sua-feature`
4. Commit com mensagens claras
5. Push e abra um PR

## 📝 Licença

Projeto desenvolvido para fins educacionais.

---

**Desenvolvido com ❤️ para educação em matemática**

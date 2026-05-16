# Início do Projeto SIDIAM

Este arquivo descreve os primeiros passos para começar a implementação do SIDIAM.

## 1. Escolher a stack tecnológica

Sugestões:

- **Node.js + Express + React** — rápido para MVP web full-stack
- **Python + FastAPI + Vue/React** — bom para API e prototipagem ágil
- **Django + Django REST Framework** — forte suporte a dados e autenticação

## 2. Definir os primeiros domínios

Com base em `docs/MVP-001-visao-e-requisitos.md` e `docs/ADR-001-especificacao-tecnica.md`:

- Usuários: professores, instituições, administradores
- Turmas e alunos
- Registros pedagógicos e diagnósticos
- Avaliações e correções manuais

## 3. Criar a estrutura inicial do projeto

- `src/backend/` — código do backend
- `src/frontend/` — código do frontend
- `src/shared/` — tipos e modelo de domínio compartilhado

## 4. Primeiro MVP sugerido

1. Cadastro de professor
2. Criação de turma
3. Cadastro de aluno
4. Registro manual de dificuldade por aluno
5. Exibição básica de turmas e alunos

## 5. Próximas tarefas

- [ ] Definir stack preferida
- [ ] Criar repositório Git (se ainda não existir)
- [ ] Inicializar o projeto com `package.json` ou `pyproject.toml`
- [ ] Construir o modelo de dados inicial
- [ ] Implementar endpoints ou páginas básicas

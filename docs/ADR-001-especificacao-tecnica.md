# ADR-001: Especificação Técnica — Plataforma SIDIAM

**Status:** Proposta  
**Data:** 2026-03-05  
**Autores:** Equipe SIDIAM

---

## 1. Contexto e Visão Geral

### 1.1 Objetivo

A Plataforma SIDIAM (Sistema de Diagnóstico em Matemática) é uma solução que transforma respostas e erros de avaliações em dados pedagógicos estruturados, permitindo que o professor:

- Corrija rapidamente via cartão-resposta e QR
- Identifique padrões de dificuldade por aluno e turma
- Realize diagnóstico longitudinal (mensal)
- (Futuro) Receba sugestões de intervenções e questões recomendadas via IA

### 1.2 Princípios Guia


| Princípio                | Descrição                                                                           |
| ------------------------ | ----------------------------------------------------------------------------------- |
| Professor como rotulador | A IA apoia, mas o professor classifica os erros — garante qualidade e credibilidade |
| Dados como ativo         | Cada correção e rótulo alimenta diagnóstico e estatísticas reutilizáveis            |
| LGPD by design           | Tokens em QR, controle de acesso, anonimização e retenção configuráveis             |


---

## 2. Decisões Arquiteturais

### ADR-002: Autenticação e Autorização

**Decisão:** Sistema de autenticação baseado em email/senha com roles hierárquicos.

**Contexto:** Professores podem atuar em múltiplas escolas; admins precisam de escopos distintos.

**Detalhes:**

- **Tabela `users`:** `id` (UUID), `email` (unique), `password_hash`, `role` (teacher | admin)
- **Tabela `school_memberships`:** Associação usuário–escola com `role_in_school` e `status`
- Permite um professor ter acesso a mais de uma escola/rede no futuro
- Recuperação de senha via token temporário (expira em ~1h)

**Alternativas consideradas:**

- OAuth externo (Google/Microsoft): deixado para fase posterior

---

### ADR-003: Modelo de Turmas e Alunos

**Decisão:** Identidade permanente do estudante separada do vínculo temporário com a turma via tabela intermediária de matrícula (`student_enrollments`).

**Contexto:** Alunos mudam de turma ao longo do ano (reclassificação, troca de turno, repetência). Vincular o aluno diretamente a uma turma via `class_id` impede histórico escolar e diagnósticos longitudinais sem perda de contexto.

**Detalhes:**

- `**classes`:** `school_id`, `year_grade`, `name`, `shift`, `created_by`
- `**students`:** `school_id`, `display_name`, `external_code` (opcional), `is_active` — *sem* `class_id` direto
- `**student_enrollments`:** `student_id`, `class_id`, `start_date`, `end_date` (nullable), `status` (active | transferred | concluded), `created_at`
  - Registra o relacionamento aluno–turma com datas de início e fim
  - Permite histórico de movimentações (mudança de turma, conclusão, transferência)
  - Para consultas da turma atual: `status = 'active'` e `end_date IS NULL`
- `display_name` pode ser anonimizado (ex.: "Aluno 01") conforme LGPD
- `external_code` permite integração com matrícula oficial sem expor dados sensíveis

**Alternativas consideradas:**

- Vínculo direto `students.class_id`: descartado por não suportar histórico e movimentações

---

### ADR-004: Banco de Questões

**Decisão:** Banco centralizado com visibilidade em níveis (private | school | public), hierarquia de conteúdos, relação muitos-para-muitos com habilidades e governança de imutabilidade para questões públicas.

**Contexto:** Questões precisam ser reutilizáveis, rastreáveis e associadas a conteúdos/habilidades. Uma única questão pode estar vinculada a múltiplas habilidades (BNCC, descritores de avaliações externas, currículos estaduais). Questões públicas com estatísticas consolidadas não podem ser alteradas sem corromper dados históricos.

**Detalhes:**

- `**topics`:** Conteúdos (ex.: Frações, Equação 1º grau) com `parent_id` para hierarquia
- `**skills`:** Habilidades com `code`, `description`, `grade_level`
- `**questions`:** `visibility` (private | school | public), `statement`, 5 alternativas (A–E), `topic_id`, `difficulty` (1–3), `tags` (JSON), `status` (draft | published)
  - `skill_id` direto aceito na v1; evolução recomendada para `question_skills` (veja abaixo)
- `**question_skills`** (evolução recomendada): `question_id`, `skill_id`, `is_primary` (opcional) — tabela intermediária muitos-para-muitos para flexibilidade curricular e alinhamento BNCC
- **Governança:** Questões com `visibility = public` e `status = published` tornam-se **imutáveis**. Adaptações exigem cópia derivada (clone) ou nova versão; o original preserva suas métricas históricas.
- `question_stats` e `question_error_stats` alimentam estatísticas agregadas

---

### ADR-005: Avaliações e Versões (A/B/C)

**Decisão:** Avaliações com múltiplas versões, seed para randomização reproduzível e mapeamento explícito de alternativas em JSON estruturado.

**Contexto:** Versões A/B/C com questões e alternativas embaralhadas precisam de gabarito correto por versão. A randomização deve ser reproduzível e a correção sempre consistente.

**Detalhes:**

- **`assessments`:** `school_id`, `class_id`, `title`, `date`, `header_template_id`, `num_versions`, `omr_template`, `status`
- `**assessment_versions`:** `version_label` (A/B/C), `seed` para reproduzir embaralhamento
- `**assessment_questions`:** `order_index`, `mapping` (JSON estruturado — veja abaixo)
- **Estrutura do `mapping`** (por questão, quando alternativas forem embaralhadas):
  ```json
  {
    "original_order": ["A", "B", "C", "D", "E"],
    "shuffled_order": ["C", "A", "E", "B", "D"],
    "correct_original": "B",
    "correct_shuffled_label": "D",
    "position_map": { "0": "C", "1": "A", "2": "E", "3": "B", "4": "D" }
  }
  ```
  - `original_order`: ordem canônica das alternativas na questão
  - `shuffled_order`: ordem exibida ao aluno nesta versão
  - `correct_original`: letra correta no gabarito canônico
  - `correct_shuffled_label`: letra que o aluno vê e marca quando a correta é a opção exibida nessa posição
  - `position_map`: mapeamento posição → rótulo visível (para OMR e correção)
- A correção compara `marked_option` do aluno com `correct_shuffled_label` (ou equivalente via `position_map`)

---

### ADR-006: Cartões-Resposta e OMR

**Decisão:** Sistema opera **exclusivamente com templates OMR padronizados e homologados**; cartões com QR único por aluno/avaliação/versão; OMR via PWA no celular; armazenamento de respostas e status de scan.

**Contexto:** Correção rápida em sala; QR não expõe nome (apenas token); OMR precisa lidar com perspectiva e bolhas. Layouts arbitrários aumentam risco de falhas, inconsistência na geração de PDFs e baixa confiabilidade da correção automática.

**Detalhes:**

- **Templates OMR padronizados:** O sistema trabalha com um conjunto **controlado e homologado** de modelos, por exemplo:
  - Quantidade fixa de questões: 20, 30, 40 ou 50
  - Número fixo de alternativas (ex.: 5, A–E)
  - Organização visual previamente conhecida pelo pipeline (colunas, espaçamento, posição do QR)
- **Sem layouts livres:** Não é permitido criar provas ou cartões com layout customizado arbitrário; apenas selecionar um template existente.
- `**answer_sheets`:** `assessment_id`, `assessment_version_id`, `student_id`, `qr_token` (unique), `scanned_at`, `scan_status` (pending | ok | manual_review), `score`
- `**student_answers`:** `answer_sheet_id`, `question_id`, `marked_option`, `is_correct`, `confidence` (opcional)
- Fluxo OMR: captura → correção de perspectiva → detecção de bolhas (posições conhecidas) → mapeamento para respostas
- `scan_status = manual_review` para casos de dúvida do OMR

**Impacto:** Essa decisão afeta diretamente a implementação do scanner, a geração dos PDFs, a confiabilidade da correção automática e a experiência do professor. Padronização aumenta precisão e reduz falhas.

---

### ADR-007: Classificação de Erros do Processo

**Decisão:** Professor classifica erro por questão errada em tipos: operacional, conceitual, interpretativo, estratégico. **Um único rótulo principal por questão errada** na primeira versão.

**Contexto:** Esses rótulos alimentam diagnóstico e futura IA; professor é a fonte de verdade.

**Justificativa para rótulo único:**

1. **Reduzir carga cognitiva:** Durante a correção, o professor não precisa decidir entre múltiplas categorias por questão; escolhe o tipo predominante.
2. **Aumentar consistência dos dados:** Menos ambiguidade entre rótulos; dados mais uniformes para análise e agregação.
3. **Facilitar treinamento supervisionado da IA:** Um rótulo por instância simplifica datasets e evita problemas de multi-label na fase inicial de aprendizado de máquina.

**Detalhes:**

- `**process_error_labels`:** `answer_sheet_id`, `question_id`, `error_type`, `notes`, `labeled_by`, `created_at`
- Evolução para múltiplos rótulos por questão pode ser considerada em versão futura, após validação pedagógica.
- Esses dados alimentam `question_error_stats` e `student_mastery.error_pattern`

---

### ADR-008: Diagnóstico Longitudinal

**Decisão:** Tabela `student_mastery` para domínio por aluno/conteúdo; nível de domínio **derivado de métricas calculadas**, não arbitrário; relatórios gerados em batch (mensal) ou incremental.

**Contexto:** Necessidade de visão evolutiva por aluno e por conteúdo ao longo do tempo.

**Critérios para cálculo do `mastery_level`:**

O indicador será derivado de evidências acumuladas, incluindo:

- **Taxa de acerto** (`accuracy_rate`): proporção de questões corretas no conteúdo
- **Frequência de erro:** número de tentativas com erro vs. total
- **Recorrência temporal:** persistência dos erros ao longo do tempo (ex.: erros em avaliações consecutivas)
- **Peso por tipo de erro:** erros conceituais e estratégicos têm peso maior que operacionais e interpretativos na determinação do nível

A fórmula matemática completa pode ser refinada em iteração futura; o documento deixa explícito que o nível de domínio **não será arbitrário**, e sim resultado de processo calculado a partir dessas evidências.

**Detalhes:**

- `**student_mastery`:** `student_id`, `topic_id` (ou `skill_id`), `mastery_level` (green | yellow | red), `accuracy_rate`, `error_pattern` (JSON), `updated_at`
- Relatórios em 3 níveis:
  1. **Por aluno:** conteúdos críticos, padrão de erro predominante, evolução temporal
  2. **Por turma:** conteúdos com maior erro, erros mais comuns, alunos para intervenção
  3. **Por questão:** taxa de acerto, distratores mais marcados, erros cognitivos associados

---

### ADR-009: Segurança e LGPD

**Decisão:** Tokens em QR (sem dados pessoais), controle de acesso por escola/turma, **estrutura explícita de auditoria** (`audit_logs`), anonimização e política de retenção.

**Contexto:** Dados de crianças e adolescentes exigem conformidade rigorosa. Logs genéricos são insuficientes; é necessária modelagem técnica para rastreabilidade de ações sensíveis.

**Detalhes:**


| Requisito          | Implementação                                                        |
| ------------------ | -------------------------------------------------------------------- |
| QR sem exposição   | `qr_token` único; mapeamento interno no servidor                     |
| Controle de acesso | Professor vê apenas turmas/escolas em que é membro                   |
| Auditoria          | Tabela `audit_logs` — veja ADR-011                                   |
| Anonimização       | `display_name` configurável; `external_code` opcional                |
| Retenção           | Campos `data_retention_until`, `anonymized_at`; política documentada |
| Consentimento      | Campo `consent_date` em `students` (se aplicável)                    |


---

### ADR-010: Evolução da IA

**Decisão:** IA progressiva — regras + estatística no início; modelos aprendendo com rótulos do professor em fases posteriores.

**Contexto:** Dados de qualidade dependem dos rótulos do professor; IA deve complementar, não substituir.

**Detalhes:**

- **Fase inicial:** Regras baseadas em `question_stats`, `question_error_stats`, padrões de distratores
- **Fase 2:** Sugestões de tipo de erro provável; alunos em risco; intervenções recomendadas
- **Fase 3:** Recomendação de questões do banco para reforço; modelo treinado com `process_error_labels`

---

### ADR-011: Auditoria e Rastreabilidade

**Decisão:** Tabela `audit_logs` para registro explícito de ações sensíveis no sistema.

**Contexto:** LGPD e governança exigem rastreabilidade de quem fez o quê e quando. Logs de aplicação são insuficientes; é necessária estrutura persistente e estruturada.

**Detalhes:**

- `**audit_logs`:** `id`, `user_id`, `action`, `entity_type`, `entity_id`, `payload` (JSON opcional), `ip_address`, `created_at`
- **Ações registradas:** acessos, alterações de avaliações, correções, publicação de questões, classificação de erros, criação/edição de alunos e turmas
- Facilita conformidade legal, investigação de incidentes e revisão de alterações críticas

---

### ADR-012: Templates de Cabeçalho e Documentos

**Decisão:** Tabela dedicada `header_templates` para armazenar modelos de cabeçalho de provas de forma estruturada e reutilizável.

**Contexto:** O uso de `header_template_id` em avaliações pressupõe uma entidade específica. Sem ela, professores dependeriam de soluções improvisadas; com ela, podem editar, reutilizar e compartilhar modelos de maneira consistente.

**Detalhes:**

- `**header_templates`:** `id`, `school_id` (nullable para templates globais), `created_by`, `name`, `template_type` (header | full_page), `config` (JSON estruturado: logo, texto, layout), `created_at`, `updated_at`
- Permite ao professor criar, editar e associar cabeçalhos a avaliações
- `config` pode incluir referência a imagem (URL ou blob), campos de texto (escola, disciplina, data) e posicionamento

---

### ADR-013: Visualização Diagnóstica por Mapa da Sala

**Decisão:** A plataforma oferecerá, de forma opcional, um modo de identificação pedagógica baseado em mapa da sala de aula, no qual cada posição do ambiente pode funcionar como identificador do estudante ou do assento.

**Contexto:** Em ambientes escolares, a organização física da sala segue um padrão estável de assentos. Alguns contextos exigem políticas rigorosas de privacidade e preferem evitar o armazenamento direto de nomes. A posição do aluno no mapa pode funcionar como identificador pedagógico opcional (pseudonimização) e como ferramenta visual de diagnóstico.

**Detalhes do modo:**

- O professor configura um layout da sala (fileiras, colunas ou posições livres)
- Cada posição identificada por rótulo de assento (ex.: A1, B3, Fila2-Assento4)
- Registros de desempenho podem ser associados ao assento em vez do nome
- O professor pode, opcionalmente, vincular um estudante nominal ao assento ou manter apenas o identificador espacial
- Interface visual de mapa da sala com indicadores pedagógicos por posição
- Ao clicar em um assento, exibição dos dados diagnósticos associados

**Funcionalidade da interface:**

| Elemento | Descrição |
| -------- | --------- |
| Por assento | Identificador, indicador visual de domínio, status de desempenho |
| Verde | Domínio consolidado |
| Amarelo | Domínio instável |
| Vermelho | Domínio crítico |
| Painel detalhado | Taxa de acerto, conteúdos com erro, tipos de erro, histórico, evolução, observações |

**Modos de identificação:**

| Modo | Descrição |
| ---- | --------- |
| Nominal | Uso do nome do aluno |
| Código | Matrícula ou identificador interno |
| Assento | Posição no mapa da sala |

**Controle de mudança de assentos:** confirmação periódica, atualização manual, controle temporal do vínculo estudante–assento.

**Impacto na arquitetura — novas entidades:**

| Entidade | Descrição |
| -------- | --------- |
| `classroom_layouts` | Layout da sala por turma (fileiras, colunas, posições) |
| `seats` | Assentos em cada layout (rótulo, posição, ordem) |
| `seat_assignments` | Vínculo temporal estudante–assento (`start_date`, `end_date`) |

**Impacto LGPD:** minimização de dados — nome pode ser omitido; apenas identificador do assento; correspondência aluno–assento sob controle do professor.

---

## 3. Modelo de Dados (Resumo)

```
users ──┬── school_memberships ── schools
        │
        ├── classes (created_by) ── schools
        │       ├── student_enrollments ── students
        │       ├── classroom_layouts ── seats   [opcional, ADR-013]
        │       └── (students via enrollments)
        │
        ├── questions (owner_user_id)
        │       ├── topics
        │       ├── question_skills ── skills   [muitos-para-muitos]
        │       └── question_stats / question_error_stats
        │
        ├── process_error_labels (labeled_by)
        │
        └── audit_logs (user_id)

students ── school_id
    └── student_enrollments ── classes
    └── seat_assignments ── seats   [opcional, ADR-013]

header_templates ── schools, users (created_by)

assessments ── schools, classes, header_templates
    └── assessment_versions
            └── assessment_questions ── questions

answer_sheets ── assessments, assessment_versions, students
    └── student_answers ── questions
    └── process_error_labels

student_mastery ── students, topics/skills
```

---

## 4. Fluxos Principais

### 4.1 Preparação (Professor)

1. Login → seleção de escola/turma
2. Cadastro/importação de alunos
3. Criação de avaliação: escolha de questões, ordem, cabeçalho, versões A/B/C
4. Geração de PDFs: prova, cartão-resposta OMR, folhas com QR por aluno

### 4.2 Aplicação (Sala)

1. Alunos realizam prova em papel
2. Marcação no cartão-resposta (bolhas A–E)
3. QR identifica aluno + avaliação + versão (apenas token)

### 4.3 Correção (Professor + Celular)

1. Abertura do modo scanner (PWA)
2. Escaneio do QR → OMR → correção de perspectiva → detecção de bolhas
3. Comparação com gabarito da versão → nota e lista de erros
4. Classificação opcional de erros (operacional, conceitual, interpretativo, estratégico)
5. Salvamento no histórico

### 4.4 Diagnóstico e Relatórios

1. Painel por aluno, turma e questão
2. Relatórios mensais
3. Exportação (CSV/PDF — futura)

---

## 5. Stack Tecnológica Recomendada


| Camada         | Tecnologia                           | Justificativa                                   |
| -------------- | ------------------------------------ | ----------------------------------------------- |
| Backend        | Node.js (NestJS) ou Python (FastAPI) | API REST, migrations, jobs em batch             |
| Banco de dados | PostgreSQL                           | UUID nativo, JSON, hierarquias                  |
| PDF            | Puppeteer ou jsPDF                   | Prova + cartão-resposta + QR                    |
| OMR            | OpenCV + detecção de círculos        | Correção de perspectiva e bolhas                |
| Frontend       | React/Next.js                        | SPA, integração com PWA                         |
| PWA (Scanner)  | Workbox                              | Modo offline, captura de câmera                 |
| Hospedagem     | A definir                            | Considerar Vercel/Railway + Supabase ou similar |


---

## 6. Roadmap de Implementação


| Fase           | Escopo                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| 1. Fundação    | Auth, escolas, turmas, alunos, `student_enrollments`, banco de questões, `header_templates`, `audit_logs` |
| 2. Avaliações  | Criação, versões A/B/C, geração de PDFs e QR (templates OMR homologados)                                  |
| 3. OMR         | Scanner PWA, pipeline OMR, correção automática                                                            |
| 4. Diagnóstico | Classificação de erros, relatórios, `student_mastery`, mapa da sala (opcional)                             |
| 5. IA          | Regras, sugestões, recomendações baseadas em dados                                                        |


---

## 7. Índice de ADRs


| ADR | Tema                                                             |
| --- | ---------------------------------------------------------------- |
| 001 | Especificação técnica geral (este documento)                     |
| 002 | Autenticação e autorização                                       |
| 003 | Modelo de turmas, alunos e matrículas (`student_enrollments`)    |
| 004 | Banco de questões, `question_skills`, governança e imutabilidade |
| 005 | Avaliações, versões A/B/C e estrutura do `mapping`               |
| 006 | Cartões-resposta, OMR e **templates padronizados**               |
| 007 | Classificação de erros (rótulo único justificado)                |
| 008 | Diagnóstico longitudinal e critérios de `student_mastery`        |
| 009 | Segurança e LGPD                                                 |
| 010 | Evolução da IA                                                   |
| 011 | Auditoria e rastreabilidade (`audit_logs`)                       |
| 012 | Templates de cabeçalho e documentos (`header_templates`)         |
| 013 | Visualização diagnóstica por mapa da sala |


---

## 8. Referências

- Especificação funcional SIDIAM (documento de referência)
- LGPD — Lei nº 13.709/2018
- BNCC — Matemática (conteúdos e habilidades)

---

*Este ADR deve ser revisado conforme o projeto avança e novas decisões forem tomadas.*lidades)

---

*Este ADR deve ser revisado conforme o projeto avança e novas decisões forem tomadas.*madas.*
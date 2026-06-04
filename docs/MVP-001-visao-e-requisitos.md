# MVP-001: Visao e Requisitos do MVP - Plataforma SIDIAM

**Status:** Rascunho consolidado
**Data:** 2026-03-10
**Baseado em:** ADR-001 e alinhamentos de produto posteriores
**Autores:** Equipe SIDIAM

---

## 1. Proposito do Documento

Este documento consolida a visao funcional do MVP da Plataforma SIDIAM, com foco em produto, regras de negocio e escopo inicial.

O ADR-001 permanece como referencia arquitetural e tecnica. Este documento complementa o ADR ao definir:

- objetivo real do MVP
- atores principais
- escopo da primeira versao
- regras funcionais
- fluxos centrais
- prioridades de implementacao
- itens fora do escopo inicial

---

## 2. Visao do Produto

O SIDIAM (Sistema de Diagnostico em Matematica) e uma plataforma de acompanhamento pedagogico voltada principalmente para professores, com foco em registrar, organizar e interpretar dificuldades de aprendizagem em matematica.

O valor central do produto nao está apenas na correcao de avaliacoes, mas na capacidade de transformar observacoes pedagogicas, resultados de avaliacoes e historico de turma em diagnosticos acionaveis.

No MVP, o sistema deve ser util mesmo sem OMR, QR ou IA avancada. O professor deve conseguir:

- criar e administrar turmas
- cadastrar ou importar alunos
- registrar dificuldades e pontos fortes por aluno e por conteudo
- registrar acoes pedagogicas tomadas
- aplicar ou corrigir avaliacoes manualmente
- visualizar indicadores basicos por turma, aluno e conteudo

---

## 3. Objetivo Principal do MVP

O objetivo principal do MVP e gerar diagnosticos pedagogicos a partir de registros manuais do professor e, quando existirem, a partir de avaliacoes corrigidas no sistema.

As funcionalidades de criacao de avaliacao e correcao nao sao o fim principal do produto; elas sao instrumentos para fortalecer o diagnostico pedagogico.

---

## 4. Perfis de Usuario

### 4.1 Professor

Usuario principal do MVP.

Pode:

- criar conta sem estar vinculado a uma instituicao
- criar turmas
- cadastrar alunos
- registrar dificuldades, pontos fortes e acoes pedagogicas
- criar avaliacoes objetivas
- corrigir avaliacoes manualmente
- visualizar relatorios e indicadores de suas turmas
- administrar turmas de diferentes escolas em uma conta pessoal

### 4.2 Instituicao

Conta institucional responsavel pelo acompanhamento administrativo e pedagogico das turmas vinculadas.

Pode:

- convidar professor por email
- cadastrar professor manualmente em painel
- permitir vinculacao por codigo
- visualizar turmas, alunos, avaliacoes e resultados vinculados a instituicao
- editar dados de turmas e alunos
- arquivar vinculos
- remover vinculos apenas em situacoes especificas, como transferencia, desligamento ou reorganizacao institucional

Nao deve:

- editar avaliacoes criadas pelo professor
- acessar turmas e alunos do professor que nao estejam vinculados a instituicao

### 4.3 Administrador do Sistema

Perfil tecnico ou operacional com acesso ampliado para suporte, governanca e recuperacao de dados arquivados.

Pode:

- restaurar dados arquivados
- administrar parametros globais do sistema
- acompanhar logs de auditoria das acoes criticas

---

## 5. Principios do MVP

- professor como ator central do produto
- diagnostico antes de automacao
- utilidade pratica desde a primeira versao
- arquitetura multi-instituicao desde o inicio
- historico pedagogico como ativo do sistema
- LGPD e controle de acesso como requisitos nativos
- exclusao logica e arquivamento em vez de remocao irreversivel

---

## 6. Escopo Funcional do MVP

### 6.1 Cadastro e Estrutura Academica

O sistema deve permitir:

- cadastro de professores
- cadastro de instituicoes
- vinculacao entre professor e instituicao
- criacao de turmas pelo professor
- migracao de turmas pessoais para uma instituicao quando houver vinculacao
- cadastro individual de alunos
- importacao de alunos por planilha

### 6.2 Modelo de Aluno

O aluno tera identidade unica global no sistema.

Regras:

- um aluno possui apenas um registro principal por ID
- o historico acompanha o aluno em caso de transferencia
- apenas a instituicao atual pode acessar o historico do aluno
- ao ocorrer transferencia, a instituicao anterior perde acesso
- o aluno nao pode pertencer simultaneamente a duas turmas diferentes
- mudancas de turma devem preservar historico de vinculo e datas

### 6.3 Registro Pedagogico Manual

O professor deve conseguir registrar:

- dificuldades por aluno
- dificuldades por conteudo
- pontos fortes por aluno
- observacoes gerais por turma
- checklist de tipos de dificuldade
- observacoes livres
- nivel de importancia da observacao
- data do registro
- data retroativa, quando necessario
- acao pedagogica tomada

Esses registros devem permitir diagnostico mesmo quando nao houver avaliacoes cadastradas.

### 6.4 Organizacao por Conteudo e Habilidade

O sistema deve usar modelo hibrido de classificacao:

- habilidades da BNCC
- topicos pedagogicos resumidos

As questoes e registros pedagogicos poderao ser associados:

- ao codigo da habilidade
- ao conteudo resumido
- aos dois, quando fizer sentido

### 6.5 Avaliacoes e Correcao Manual

No MVP, a plataforma deve permitir:

- criar avaliacoes objetivas com questoes em texto
- cadastrar alternativas e alternativa correta
- organizar questoes por conteudo e habilidade
- corrigir manualmente as respostas do aluno em gabarito virtual
- calcular acertos e erros apos finalizacao
- exibir estatisticas basicas por turma e por avaliacao

Neste momento, o sistema aceitaria apenas questoes objetivas em texto.

### 6.6 Painel e Diagnostico

O painel principal do professor deve:

- apresentar resumo estatistico da turma antes da lista detalhada de alunos
- destacar alunos com maiores dificuldades
- destacar conteudos com maior indice de erro
- permitir navegar entre turma, aluno e conteudo
- exibir avaliacoes e registros manuais em secoes complementares

O sistema deve ser capaz de sugerir alunos que demandam mais atencao com base em:

- frequencia de dificuldades registradas
- nivel de importancia atribuido
- reincidencia por conteudo
- quantidade de erros em avaliacoes

### 6.7 Auditoria e Arquivamento

No MVP, somente acoes criticas precisam ser auditadas.

Exemplos:

- criacao e edicao de turmas
- criacao e edicao de alunos
- vinculacao de professor com instituicao
- registro e alteracao de observacoes pedagogicas
- criacao de avaliacao
- correcao de avaliacao
- arquivamento e restauracao de dados

Dados removidos pelo usuario nao devem ser apagados fisicamente no MVP.

Regra:

- ficam arquivados
- recuperacao apenas por administrador

---

## 7. Regras de Negocio Consolidadas

### 7.1 Conta Pessoal e Vinculo Institucional

- o professor pode existir sem instituicao
- o professor pode se vincular a uma ou mais instituicoes
- cada instituicao enxerga apenas as turmas e alunos vinculados a ela
- turmas criadas pelo professor podem passar a integrar a instituicao quando houver vinculacao

### 7.2 Permissoes Institucionais

- a instituicao pode visualizar avaliacoes e resultados
- a instituicao nao edita as avaliacoes do professor
- a instituicao pode alterar turmas e alunos vinculados
- a autonomia pedagogica do professor deve ser preservada

### 7.3 Historico do Aluno

- o historico e continuo ao longo da trajetoria do aluno
- o acesso ao historico depende da vinculacao institucional atual
- a transferencia move o contexto visivel do aluno para a nova instituicao

### 7.4 Diagnostico Sem Avaliacao

Mesmo sem prova cadastrada, o sistema deve produzir leitura pedagogica com base em:

- dificuldades registradas
- pontos fortes registrados
- observacoes por turma
- acoes pedagogicas associadas

### 7.5 Diagnostico Com Avaliacao

Quando houver avaliacao, o sistema deve complementar o diagnostico com:

- taxa de acerto por turma
- taxa de acerto por aluno
- taxa de erro por questao
- conteudos com baixo desempenho
- alunos com maior acumulacao de erros

---

## 8. Telas Essenciais do MVP

### 8.1 Painel Geral do Professor

Tela principal do sistema.

Deve mostrar:

- resumo das turmas
- indicadores consolidados
- alunos com maior necessidade de atencao
- conteudos criticos
- atalhos para registros e avaliacoes

### 8.2 Tela de Avaliacao e Correcao

Deve permitir:

- criar avaliacao objetiva
- cadastrar questoes e respostas corretas
- abrir gabarito virtual do aluno
- marcar respostas manualmente
- finalizar correcao
- gerar relatorio basico da avaliacao

### 8.3 Tela de Registro de Dificuldades e Acoes Pedagogicas

Deve permitir:

- registrar dificuldade ou ponto forte
- associar aluno, turma, conteudo e habilidade
- marcar checklist de classificacoes
- escrever observacao livre
- definir nivel de importancia
- registrar acao pedagogica
- registrar data atual ou retroativa

---

## 9. Tipos de Registro Pedagogico

O sistema deve suportar ao menos os seguintes tipos de registro no MVP:

- dificuldade individual
- ponto forte individual
- observacao geral de turma
- acao pedagogica aplicada

Campos sugeridos para cada registro:

- tipo do registro
- aluno_id (opcional em observacao de turma)
- turma_id
- habilidade_id (opcional)
- topico_id ou conteudo resumido
- checklist de classificacoes
- observacao livre
- importancia
- data do evento
- criado_por
- criado_em

---

## 10. Checklist de Classificacao Pedagogica

O sistema deve oferecer um checklist de classificacoes para o professor marcar durante o registro.

Conjunto inicial recomendado:

- operacional
- conceitual
- interpretativo
- estrategico

Definicoes de referencia:

- operacional: dificuldade na execucao de tecnicas, algoritmos ou calculos
- conceitual: dificuldade de compreensao dos fundamentos matematicos
- interpretativo: dificuldade para ler, traduzir ou compreender o contexto do problema
- estrategico: dificuldade para escolher a melhor abordagem de resolucao

Esse checklist pode coexistir com anotacoes livres do professor.

---

## 11. Relatorios Minimos do MVP

O MVP deve entregar pelo menos os seguintes resultados:

- alunos com maiores dificuldades
- conteudos com maior incidencia de erro
- quantidade de registros por tipo de dificuldade
- historico basico de observacoes por aluno
- acertos e erros por avaliacao
- questoes com maior indice de erro

---

### 12. Itens Fora do Escopo Inicial

Ficam fora da primeira versao:

- OMR com camera e leitura automatica
- QR por aluno e versao
- importacao automatica de questoes por link ou scraping
- questoes discursivas
- recomendacao automatica de intervencao pedagogica
- mapas de sala completos e interativos
- analises avancadas de IA em producao


Esses itens continuam relevantes para fases posteriores.

---

## 13. Evolucao Prevista

### Fase posterior 1

- criacao de banco de questoes mais robusto
- organizacao por BNCC e topicos com filtros mais avancados
- correcoes e relatorios mais completos

### Fase posterior 2

- mapa da sala com anonimização por assento
- codigos de aluno e visualizacao espacial da turma
- movimentacao visual sem perda de historico

### Fase posterior 3

- OMR
- QR por aluno e avaliacao
- pipeline de correcao automatica

### Fase posterior 4

- IA para sugerir tipo de erro por padrao de resposta
- IA para sugerir intervencoes pedagogicas
- IA para identificar alunos em risco com maior precisao

---

## 14. Stack Inicial Recomendada

Com base nas decisoes atuais:

- backend: FastAPI
- banco de dados: PostgreSQL
- frontend web: a definir, com preferencia por stack moderna compativel com painel administrativo e visualizacoes
- autenticacao: email e senha
- armazenamento de dados arquivados: no proprio banco com estrategia de soft delete ou arquivamento logico

---

## 15. Riscos e Pontos de Atencao

### 15.1 Governanca de Dados do Aluno

A identidade global do aluno traz valor pedagogico, mas exige cuidado com:

- permissao de acesso entre instituicoes
- transferencia segura de contexto
- historico visivel apenas para a instituicao atual
- conformidade com LGPD

### 15.2 Complexidade de Escopo

O projeto tem visao ampla. O principal risco e tentar construir todas as camadas ao mesmo tempo.

Recomendacao:

- priorizar o diario pedagogico
- entregar painel funcional cedo
- tratar avaliacao e automacao como camadas incrementais

### 15.3 Qualidade do Diagnostico

No inicio, a qualidade do diagnostico dependera mais da consistencia dos registros do professor do que de automacao estatistica.

Isso torna importante:

- formular bem os campos de registro
- reduzir friccao no preenchimento
- permitir observacao livre e checklist ao mesmo tempo

---

## 16. Definicao Operacional do MVP

Considera-se que o MVP esta pronto quando um professor conseguir:

1. criar uma conta
2. criar ou importar alunos e turmas
3. registrar dificuldades e pontos fortes por aluno e conteudo
4. registrar acoes pedagogicas
5. criar uma avaliacao objetiva simples
6. corrigir manualmente respostas de alunos
7. visualizar quais alunos e conteudos demandam mais atencao

---

## 17. Relacao com o ADR-001

Este documento complementa o ADR-001 e deve orientar as prioridades imediatas de implementacao do produto.

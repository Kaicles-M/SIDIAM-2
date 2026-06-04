# SIDIAM 2 - Diretrizes do Projeto

## Padrões de Desenvolvimento

1. **Testes Contínuos:** 
   - A cada nova implementação, é OBRIGATÓRIO executar os testes automatizados para verificar possíveis erros.
   - Use o comando `npm test` para rodar os testes de integração e fumaça (smoke tests).
   - Testes "pré-prontos" (como os localizados em `src/backend/tests/`) servem como baseline e devem ser re-executados a cada alteração no sistema.
   - Nenhuma funcionalidade é considerada completa sem a validação dos testes existentes e a adição de novos testes para o caso específico.

2. **Como Executar os Testes:**
   - No terminal raiz do projeto, execute: `npm test`.
   - Isso executará o framework Jest e verificará a saúde da API e os fluxos críticos (Professores -> Turmas -> Alunos -> Registros).


2. **Arquitetura:**
   - Seguir rigorosamente o ADR-001 e MVP-001.
   - Priorizar o diagnóstico pedagógico antes da automação (OMR/IA).

3. **Backend:**
   - Atualmente utilizando persistência em memória (Node.js). Futura migração planejada para PostgreSQL.

4. **Frontend:**
   - React com Vanilla CSS. Focar em interfaces limpas e funcionais para professores.

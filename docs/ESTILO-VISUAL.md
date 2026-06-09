# Guia de Estilo Visual - SIDIAM 2

## 🎨 Identidade Visual

O SIDIAM deve ter uma identidade visual que transmita **confiança, clareza e acessibilidade** para educadores. O design deve priorizar a funcionalidade sem sacrificar a estética moderna.

---

## 📐 Paleta de Cores

### Cores Primárias
- **Azul Principal**: `#1E40AF` — Confiança, educação, estabilidade
  - Claro: `#DBEAFE`
  - Escuro: `#0C2340`

- **Verde Destaque**: `#10B981` — Sucesso, progresso, validação
  - Claro: `#DCFCE7`
  - Escuro: `#065F46`

### Cores Secundárias
- **Laranja Aviso**: `#F97316` — Atenção, dificuldades, alertas
  - Claro: `#FED7AA`
  - Escuro: `#7C2D12`

- **Vermelho Crítico**: `#DC2626` — Erros, ações destrutivas
  - Claro: `#FEE2E2`
  - Escuro: `#7F1D1D`

### Cores Neutras
- **Cinza Escuro**: `#1F2937` — Textos principais
- **Cinza Médio**: `#6B7280` — Textos secundários, helper text
- **Cinza Claro**: `#F3F4F6` — Fundos, separadores
- **Branco**: `#FFFFFF` — Fundos de cards e containers

---

## 🔤 Tipografia

### Fonte Principal
- **Inter** ou **Poppins** — Moderna, legível, friendly
  - Pesos: Regular (400), Medium (500), Semi-bold (600), Bold (700)

### Uso
```
Headings (H1)  → 32px, Bold (700), line-height: 1.2
Headings (H2)  → 24px, Semi-bold (600), line-height: 1.3
Headings (H3)  → 20px, Semi-bold (600), line-height: 1.4
Body Text      → 16px, Regular (400), line-height: 1.6
Small Text     → 14px, Regular (400), line-height: 1.5
Labels         → 12px, Medium (500), line-height: 1.4
```

### Contraste
- Minimum WCAG AA (4.5:1) para todos os textos
- Especial atenção para links: sempre com cor + underline ou ícone

---

## 🎯 Componentes e Layout

### Estrutura Geral
```
┌─────────────────────────────────────────────┐
│           HEADER/NAVBAR                     │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ SIDEBAR  │      CONTEÚDO PRINCIPAL         │
│          │    (Responsive: collapse em      │
│          │     mobile)                      │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

### Navbar
- Altura: 64px
- Cor: Azul Principal (#1E40AF)
- Elementos: Logo + Menu Hamburger + User Profile + Logout
- Responsivo: Menu colapsável em < 768px

### Sidebar
- Largura: 256px (desktop) / collapsed (mobile)
- Cor de fundo: Cinza Claro (#F3F4F6)
- Menu items com ícones + texto
- Highlight do item ativo em Azul Claro
- Smooth collapse transition (0.3s)

### Cards
- Border radius: 8px
- Shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Padding: 20px
- Background: Branco
- Hover: Shadow aumenta, fundo cinza claro
- Transição: 0.2s ease

### Botões
```
Primary Button
├─ Background: Azul Principal
├─ Texto: Branco
├─ Padding: 10px 16px
├─ Border radius: 6px
├─ Font weight: 500
└─ Hover: Azul Escuro + shadow

Secondary Button
├─ Background: Cinza Claro
├─ Texto: Cinza Escuro
├─ Border: 1px Cinza Médio
└─ Hover: Cinza Médio background

Danger Button
├─ Background: Vermelho Crítico
├─ Texto: Branco
└─ Hover: Vermelho Escuro

Ghost Button (transparente)
├─ Background: Transparente
├─ Texto: Azul Principal
└─ Hover: Azul Claro background
```

### Campos de Formulário
- Altura: 40px
- Padding: 8px 12px
- Border: 1px solid Cinza Médio
- Border radius: 6px
- Focus: Border Azul Principal, shadow azul suave
- Label: 12px, Medium, acima do campo
- Helper text: Cinza Médio, 12px
- Error state: Border Vermelho, ícone X, mensagem em vermelho

### Tabelas
- Header: Fundo Cinza Claro, texto Cinza Escuro bold
- Rows: Branco com alternância cinza suave em every 2nd row
- Borders: 1px Cinza Claro
- Padding: 12px 16px
- Hover row: Fundo azul suave
- Responsive: Scroll horizontal em mobile

### Badges/Tags
```
Success  → Verde background, verde-escuro text, 4px padding, 4px radius
Warning  → Laranja background, laranja-escuro text
Danger   → Vermelho background, vermelho-escuro text
Info     → Azul background, azul-escuro text
Default  → Cinza background, cinza-escuro text
```

---

## 📊 Padrões Visuais

### Estados de Dados
- ✅ **Sucesso** → Verde Destaque com ícone check
- ⚠️ **Aviso** → Laranja com ícone alert (ex: aluno com dificuldades)
- ❌ **Erro/Crítico** → Vermelho com ícone X
- ℹ️ **Informação** → Azul com ícone info
- ⏳ **Carregando** → Spinner azul, skeleton loaders para conteúdo

### Ícones
- Biblioteca: **Heroicons** ou **Feather Icons**
- Tamanho padrão: 20px (UI), 24px (buttons)
- Cor: Herdar cor do contexto (cinza para disabled, azul para links)
- Estilo: Outlined (não filled)

### Espaçamento (Grid 4px)
```
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 20px
xxl: 24px
```

---

## 🎓 Contexto Educacional

### Dashboard para Professores
- **Card de Turmas**: Mostrar quantidade de alunos, avaliações pendentes
- **Card de Progresso**: Indicadores visuais (gauge charts) de desempenho
- **Notificações**: Alunos que precisam de atenção (background laranja suave)

### Painel de Avaliações
- Questões com clara separação entre enunciado e opções
- Cores em alternância para múltipla escolha
- Resposta correta em verde, incorreta em vermelho (após submissão)

### Visualizações de Desempenho
- Gráficos simples e claros
- Use cores da paleta para representar categorias
- Tooltips ao passar mouse com dados específicos

---

## 🌙 Modo Escuro (Futuro)

Para suportar modo escuro:
- Fundo: `#111827`
- Texto principal: `#F3F4F6`
- Texto secundário: `#9CA3AF`
- Cards: `#1F2937`
- Sidebar: `#0F172A`

---

## ♿ Acessibilidade

1. **Contraste**: Mínimo 4.5:1 para texto (WCAG AA)
2. **Focus Indicators**: Outline azul visível em tabs
3. **Labels**: Sempre associados aos inputs
4. **Ícones**: Nunca apenas ícone sem texto em buttons críticos
5. **Animações**: Respeitar `prefers-reduced-motion`
6. **Cores**: Não confiar apenas em cor (usar ícones também)

---

## 🎬 Animações e Transições

### Transições Padrão
- Hover de links/buttons: 0.2s ease
- Collapse/expand de menu: 0.3s ease-in-out
- Fade de modais: 0.2s ease-out
- Slide de notificações: 0.3s ease-out

### Loading State
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
/* duração: 1s, cubic-bezier(0.4, 0, 0.6, 1) */
```

### Avisos/Alerts
- Slide in de cima: `translateY(-10px) → 0`
- Duração: 0.3s

---

## 📱 Responsive Design

### Breakpoints
```
Mobile:     < 640px   (todos os componentes 100% width)
Tablet:     640px-1024px (2 colunas, sidebar colapsada)
Desktop:    > 1024px  (layout completo)
```

### Ajustes por Breakpoint
- **Mobile**: Font sizes reduzidas 10%, padding reduzido 50%
- **Tablet**: Sidebar toggle, cards em grid 2 colunas
- **Desktop**: Layout full com sidebar 256px

---

## 🎨 Implementação CSS

### Framework Recomendado
**TailwindCSS** — Utilities-first, alinha perfeitamente com este guia

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: {
        50: '#EFF6FF',
        500: '#1E40AF',
        900: '#0C2340',
      },
      success: {
        50: '#DCFCE7',
        500: '#10B981',
        900: '#065F46',
      },
      warning: {
        50: '#FED7AA',
        500: '#F97316',
        900: '#7C2D12',
      },
      error: {
        50: '#FEE2E2',
        500: '#DC2626',
        900: '#7F1D1D',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'Poppins'],
      },
      borderRadius: {
        DEFAULT: '6px',
      },
    },
  },
}
```

---

## 📸 Exemplos Visuais de Páginas

### 1. Login
- Fundo gradiente azul claro → branco
- Card centralizado (400px) com shadow
- Logo SIDIAM no topo
- Form com 2 campos (email, senha)
- Botão "Entrar" azul primário (full width)
- Link "Esqueceu a senha?" cinza

### 2. Dashboard (Home)
- Header com título + data
- Grid de 4 cards KPI: 
  - Total de turmas (azul)
  - Total de alunos (verde)
  - Avaliações pendentes (laranja)
  - Alunos com dificuldades (vermelho)
- Abaixo: 2 seções
  - "Turmas Recentes" (table)
  - "Alertas Pedagógicos" (lista com badges)

### 3. Página de Turmas
- Barra de busca + filtro no topo
- Cards em grid 3 colunas (responsive)
- Cada card: Nome turma, professor, quantidade alunos, status
- Hover: Shadow aumenta, overlay button "Ver detalhes"
- Modal de criar turma com form

### 4. Página de Alunos (por Turma)
- Tabela com: Nome, Status, Última Avaliação, Dificuldades Detectadas
- Status badge: Verde (ok), Laranja (atenção), Vermelho (crítico)
- Dificuldades como tags coloridas
- Ação: Clique para ver detalhes/registros pedagógicos

### 5. Avaliação (Formulário)
- Progresso no topo (x/total questões)
- Uma questão por tela
- Título grande e legível
- Opções com radio buttons ou checkboxes (estilo limpo)
- Botões "Anterior" e "Próxima" (disabled quando apropriado)
- Botão "Submeter" destacado no final

---

## 🔄 Fluxo de Cores por Contexto

| Contexto | Cor | Uso |
|----------|-----|-----|
| Professor autorizado | Verde | Badges, status |
| Aluno com dificuldades | Laranja | Alerts, flags |
| Avaliação pendente | Azul | Cards, badges |
| Erro no sistema | Vermelho | Alerts, disabled states |
| Sucesso de ação | Verde | Toasts, checkmarks |
| Info/hint | Cinza | Helper text, secondary actions |

---

## 🎯 Princípios de Design

1. **Clareza** — Cada elemento tem propósito claro
2. **Consistência** — Padrões aplicados uniformemente
3. **Minimalismo** — Sem "poluição visual"
4. **Acessibilidade** — Legível para todos
5. **Responsividade** — Funciona em todos os dispositivos
6. **Feedback** — Usuário sempre sabe o que está acontecendo
7. **Educacional** — Design reforça propósito pedagógico

---

## 📝 Próximas Etapas

1. ✅ Implementar paleta de cores em Tailwind/CSS Variables
2. ✅ Criar componentes base (Button, Input, Card, etc.)
3. ✅ Desenvolver sistema de ícones
4. ✅ Testes de acessibilidade (axe DevTools)
5. ✅ Design responsive em mobile-first
6. ✅ Documentação de componentes (Storybook - opcional)

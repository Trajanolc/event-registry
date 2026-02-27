# Design — Event Registry

Protótipos UX em Markdown + ASCII art para o Event Registry.

**Vibe:** jovem, despojado, moderno — app cultural/urbano.

---

## Telas

| Arquivo | Tela | Descrição |
|---------|------|-----------|
| [tela-01-chat-cadastro.md](./tela-01-chat-cadastro.md) | Chat de Cadastro | Chat conversacional com LLM para coleta dos dados do evento |
| [tela-02-confirmacao.md](./tela-02-confirmacao.md) | Confirmação do Evento | Card de revisão com destaques de data/hora/valor e descrição turbinada |
| [tela-03-lista-eventos.md](./tela-03-lista-eventos.md) | Lista de Eventos | Grid/lista de cards com FAB para novo cadastro |

---

## Fluxo de Navegação

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  [Tela 03 — Lista] ──→ [FAB +✨] ──→ [Tela 01 — Chat]  │
│         ↑                                    │          │
│         │                         (todos campos ok)     │
│         │                                    ↓          │
│   (após salvar)            [Tela 02 — Confirmação]      │
│         │                        │        │             │
│         └─── Confirmar e Salvar ─┘        │             │
│                                 ← Voltar e Ajustar      │
│                                           │             │
│                                    [Tela 01 — Chat]     │
└─────────────────────────────────────────────────────────┘
```

---

## Resumo Visual

### Tela 01 — Chat de Cadastro
- Header com logo
- Checklist lateral de progresso (10 campos)
- Área de chat com bolhas LLM (esquerda) e usuário (direita)
- Input fixo na base

### Tela 02 — Confirmação do Evento
- Card completo com dados do evento
- Blocos destacados: data/hora (âmbar) e valor (menta)
- Seção `versão turbinada ✨` com descrição reescrita pela LLM
- Mini-chat inline para ajuste da descrição
- Botões: `← Voltar e Ajustar` | `Confirmar e Salvar ✓`

### Tela 03 — Lista de Eventos
- Cards com emoji temático, tipo, data, local, valor e vagas
- Ordenação por data (padrão), nome ou tipo
- FAB `+✨` fixo para novo cadastro
- Estado vazio com mensagem encorajadora

---

## Notas Gerais para o Frontend

- Stack: Next.js (React) + FastAPI
- Dark mode como padrão — paleta escura com acentos vibrantes
- Mobile-first: o checklist lateral da Tela 01 vira chip de progresso no mobile
- Emojis são parte do design — não substituir por ícones genéricos
- Animações sutis: slide-in para novos cards, fade para transições entre telas

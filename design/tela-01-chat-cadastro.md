# Tela 01 — Chat de Cadastro

**Objetivo:** Coletar dados do evento via conversa natural com a LLM.

---

## Layout

```
╔══════════════════════════════════════════════════════════╗
║  🎪 event registry                              [≡] [+] ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  ╔══════════════════════╗                                ║
║  ║  📋 Campos coletados ║                                ║
║  ╠══════════════════════╣                                ║
║  ║ ✅ nome              ║                                ║
║  ║ ✅ tipo              ║                                ║
║  ║ ✅ data              ║                                ║
║  ║ ✅ horário início    ║                                ║
║  ║ ⬜ horário fim       ║                                ║
║  ║ ⬜ local             ║                                ║
║  ║ ⬜ descrição         ║                                ║
║  ║ ⬜ valor ingresso    ║                                ║
║  ║ ⬜ capacidade        ║                                ║
║  ║ ⬜ organizador       ║                                ║
║  ╚══════════════════════╝                                ║
║                                                          ║
║  ┌──────────────────────────────────────────────────┐   ║
║  │                                                  │   ║
║  │  ╭─────────────────────────────────────────╮    │   ║
║  │  │ 🤖  Oi! Vamos cadastrar seu evento.     │    │   ║
║  │  │     Qual o nome do rolê?                │    │   ║
║  │  ╰─────────────────────────────────────────╯    │   ║
║  │                                                  │   ║
║  │          ╭──────────────────────────────────╮   │   ║
║  │          │ Show da Ana Frango, sábado às 20h │ 👤│   ║
║  │          ╰──────────────────────────────────╯   │   ║
║  │                                                  │   ║
║  │  ╭─────────────────────────────────────────╮    │   ║
║  │  │ 🤖  Mandou bem! Captei:                 │    │   ║
║  │  │     📌 Nome: Show da Ana Frango          │    │   ║
║  │  │     📅 Data: sábado (01/03)             │    │   ║
║  │  │     🕗 Início: 20h                      │    │   ║
║  │  │                                          │    │   ║
║  │  │     Qual o horário de término?           │    │   ║
║  │  ╰─────────────────────────────────────────╯    │   ║
║  │                                                  │   ║
║  └──────────────────────────────────────────────────┘   ║
║                                                          ║
║  ┌──────────────────────────────────────────┐  ╔═════╗  ║
║  │  Escreve aqui...                         │  ║  →  ║  ║
║  └──────────────────────────────────────────┘  ╚═════╝  ║
╚══════════════════════════════════════════════════════════╝
```

---

## Elementos da Tela

### Header
- Logo / nome do produto à esquerda: `🎪 event registry` (fonte bold, pequena)
- Ícone de menu `[≡]` e botão `[+]` (novo evento) à direita
- Fundo escuro com texto claro — vibe dark mode urbano

### Painel Lateral — Campos Coletados
- Checklist flutuante à esquerda mostrando progresso em tempo real
- `✅` = campo já coletado e validado
- `⬜` = campo ainda pendente
- Atualiza instantaneamente conforme a LLM extrai cada informação
- Desaparece em telas pequenas (mobile: vira um chip de progresso no topo)

### Área de Chat
- Scroll vertical, mensagens ordenadas cronologicamente
- Bolhas da LLM: alinhadas à esquerda, fundo levemente destacado, ícone `🤖`
- Bolhas do usuário: alinhadas à direita, fundo de cor primária, ícone `👤`
- Timestamps discretos entre grupos de mensagens
- A LLM pode destacar campos capturados com emojis (📌 📅 🕗 📍 💰)

### Input de Texto
- Campo de texto largo na base da tela
- Placeholder: `Escreve aqui...`
- Botão de envio `→` à direita
- Suporte a Enter para enviar, Shift+Enter para nova linha

---

## Estados

| Estado | Comportamento |
|--------|---------------|
| **Iniciando** | LLM envia primeira mensagem de boas-vindas automaticamente |
| **Coletando** | Checklist atualiza a cada campo validado |
| **Validando** | LLM questiona valores inválidos antes de aceitar |
| **Completo** | Todos campos `✅` → botão "Revisar evento" aparece no footer |
| **Erro de rede** | Banner discreto no topo: "Reconectando..." |

---

## Fluxo de Navegação

```
[Tela 01 — Chat] ──→ (todos campos coletados) ──→ [Tela 02 — Confirmação]
                  ↑
           [+ Novo evento] (volta ao início)
```

---

## Notas para o Frontend

- O checklist lateral deve ser atualizado via evento do backend (WebSocket ou SSE) quando a LLM extrai e valida um campo
- A sessão de chat deve ser persistida no backend — se o usuário recarregar, o histórico continua
- Campos com valor ambíguo ficam como `⬜` até confirmação explícita da LLM
- Quando todos os 10 campos estiverem `✅`, fazer scroll suave até um botão de "Confirmar evento →" que aparece acima do input

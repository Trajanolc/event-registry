# Tela 02 — Confirmação do Evento

**Objetivo:** Apresentar todos os dados coletados para revisão e aprovação do usuário antes de salvar.

---

## Layout

```
╔══════════════════════════════════════════════════════════╗
║  🎪 event registry                              [← Chat] ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  Confere se tá tudo certo antes de salvar 👀             ║
║                                                          ║
║  ┌────────────────────────────────────────────────────┐  ║
║  │                                                    │  ║
║  │  🎸 Show da Ana Frango                             │  ║
║  │  show · Clube do Choro, Brasília                   │  ║
║  │                                                    │  ║
║  │  ╔══════════════════════════════════════════════╗  │  ║
║  │  ║  📅  Sábado, 01 mar 2026                    ║  │  ║
║  │  ║  🕗  20h00 – 23h00                          ║  │  ║
║  │  ╚══════════════════════════════════════════════╝  │  ║
║  │                                                    │  ║
║  │  ╔══════════════════════════════════════════════╗  │  ║
║  │  ║  💰  R$ 40,00                               ║  │  ║
║  │  ╚══════════════════════════════════════════════╝  │  ║
║  │                                                    │  ║
║  │  👥 Capacidade: 200 pessoas                        │  ║
║  │  🏢 Organizador: Clube do Choro Produções          │  ║
║  │                                                    │  ║
║  │  ─────────────────────────────────────────────    │  ║
║  │  versão turbinada ✨                               │  ║
║  │  ─────────────────────────────────────────────    │  ║
║  │  Uma noite de pura música ao vivo com a aclamada  │  ║
║  │  Ana Frango Elétrico. Groove, experimentação e    │  ║
║  │  MPB reimaginada no coração de Brasília. Vem que  │  ║
║  │  essa é daquelas que você vai querer contar que   │  ║
║  │  esteve lá. 🎶                                    │  ║
║  │                                                    │  ║
║  │                            [✏️ Pedir ajuste]       │  ║
║  │                                                    │  ║
║  └────────────────────────────────────────────────────┘  ║
║                                                          ║
║  ╔══════════════════════════╗  ╔═══════════════════════╗ ║
║  ║   ← Voltar e Ajustar     ║  ║  Confirmar e Salvar ✓ ║ ║
║  ╚══════════════════════════╝  ╚═══════════════════════╝ ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## Elementos da Tela

### Header
- Mesmo header padrão com logo
- Botão `← Chat` no lugar dos ícones — retorna ao chat sem perder dados

### Subtítulo da Página
- Texto leve acima do card: `Confere se tá tudo certo antes de salvar 👀`
- Tom casual, despojado — não é formulário, é confirmação

### Card Principal

O card contém todos os campos agrupados visualmente:

**Nome e contexto (topo do card)**
- Nome do evento em destaque (bold, tamanho maior)
- Tipo do evento + local em linha menor, separados por `·`

**Bloco destacado — Data/Hora**
- Fundo diferenciado (cor de destaque, ex: laranja/âmbar suave)
- Ícone 📅 + data por extenso
- Ícone 🕗 + horário início – horário fim
- Bordas arredondadas, padding generoso

**Bloco destacado — Valor**
- Fundo diferenciado (cor secundária, ex: verde/menta suave)
- Ícone 💰 + valor formatado em BRL
- Se gratuito: `💰 Entrada gratuita`

**Dados complementares** (sem destaque)
- `👥 Capacidade: X pessoas`
- `🏢 Organizador: Nome`

**Bloco — Descrição turbinada**
- Separador horizontal com label `versão turbinada ✨` centralizado
- Texto da descrição reescrita pela LLM em itálico leve
- Botão inline `✏️ Pedir ajuste` — abre mini-chat inline para solicitar revisão da descrição

### Botões de Ação (footer fixo)
- `← Voltar e Ajustar` — estilo secundário (outline), retorna ao chat
- `Confirmar e Salvar ✓` — estilo primário (filled), cor de destaque

---

## Estados

| Estado | Comportamento |
|--------|---------------|
| **Padrão** | Card com todos os dados, botões ativos |
| **Ajustando descrição** | Mini-chat inline aparece abaixo da descrição, usuário digita pedido, LLM reescreve |
| **Salvando** | Botão "Confirmar" vira spinner, desabilitado |
| **Sucesso** | Animação de check ✅ + redirect para Tela 03 |
| **Erro** | Toast de erro, botão volta ao estado normal |

---

## Interação — Ajuste de Descrição

Quando o usuário clica em `✏️ Pedir ajuste`:

```
  ─────────────────────────────────────────────
  versão turbinada ✨
  ─────────────────────────────────────────────
  Uma noite de pura música ao vivo com a aclamada
  Ana Frango Elétrico...

  ┌─────────────────────────────────────────────┐
  │ O que você quer ajustar?                    │
  ├─────────────────────────────────────────────┤
  │  Pode ser mais curto e impactante?  [ → ]  │
  └─────────────────────────────────────────────┘
```

- LLM reescreve e substitui o texto inline
- Usuário pode pedir quantos ajustes quiser
- "Pedir ajuste" vira "Fechar" enquanto o mini-chat está aberto

---

## Fluxo de Navegação

```
[Tela 01 — Chat] ←── [← Voltar e Ajustar]
                         ↑
[Tela 02 — Confirmação] ──→ (Confirmar e Salvar) ──→ [Tela 03 — Lista]
```

---

## Notas para o Frontend

- Os dados vêm via estado da sessão (não recarregar da API — são dados locais do chat)
- O endpoint de save é `POST /events` — só chamar quando o usuário clicar em "Confirmar e Salvar"
- A descrição turbinada é uma propriedade separada (`descricao_turbinada`) do campo original (`descricao`)
- O mini-chat de ajuste da descrição deve chamar um endpoint separado: `POST /events/rewrite-description`
- Usar animação de transição ao ir para Tela 03 (slide ou fade)

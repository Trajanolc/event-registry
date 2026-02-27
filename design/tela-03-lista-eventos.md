# Tela 03 — Lista de Eventos

**Objetivo:** Exibir todos os eventos cadastrados em cards visuais, com acesso fácil para novo cadastro.

---

## Layout

```
╔══════════════════════════════════════════════════════════╗
║  🎪 event registry                          [🔍] [≡]    ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  rolês na área  (3 eventos)              📅 por data ▾  ║
║                                                          ║
║  ┌────────────────────────────────────────────────────┐  ║
║  │  🎸  Show da Ana Frango                            │  ║
║  │                                          [show]    │  ║
║  │  📅  Sáb, 01 mar · 🕗 20h – 23h                   │  ║
║  │  📍  Clube do Choro, Brasília                      │  ║
║  │  💰  R$ 40,00 · 👥 200 vagas                       │  ║
║  └────────────────────────────────────────────────────┘  ║
║                                                          ║
║  ┌────────────────────────────────────────────────────┐  ║
║  │  🍜  Feira Gastronômica do Parque                  │  ║
║  │                                    [feira gastro]  │  ║
║  │  📅  Dom, 02 mar · 🕗 10h – 18h                   │  ║
║  │  📍  Parque da Cidade, Brasília                    │  ║
║  │  💰  Entrada gratuita · 👥 500 vagas               │  ║
║  └────────────────────────────────────────────────────┘  ║
║                                                          ║
║  ┌────────────────────────────────────────────────────┐  ║
║  │  🎬  Festival de Cinema Latinoamericano            │  ║
║  │                                         [festival] │  ║
║  │  📅  Qui, 05 mar · 🕗 14h – 22h                   │  ║
║  │  📍  Cine Brasília                                 │  ║
║  │  💰  R$ 15,00 · 👥 300 vagas                       │  ║
║  └────────────────────────────────────────────────────┘  ║
║                                                          ║
║                                                          ║
║                                          ╔═══════╗       ║
║                                          ║  + ✨  ║       ║
║                                          ╚═══════╝       ║
╚══════════════════════════════════════════════════════════╝
```

---

## Elementos da Tela

### Header
- Logo `🎪 event registry` à esquerda
- Ícone de busca `🔍` e menu `[≡]` à direita

### Barra de Contexto
- Label informal à esquerda: `rolês na área` + contador de eventos entre parênteses
- Ordenação à direita: `📅 por data ▾` (dropdown com: por data, por nome, por tipo)

### Cards de Evento

Cada card contém:

| Elemento | Detalhe |
|----------|---------|
| **Emoji + Nome** | Emoji temático do tipo de evento + nome em bold |
| **Tag de tipo** | Chip/badge com o tipo no canto superior direito |
| **Data** | `📅 Dia da semana, DD mês · 🕗 HH:MM – HH:MM` |
| **Local** | `📍 Nome do local, Cidade` |
| **Valor + Vagas** | `💰 R$ X,XX · 👥 NNN vagas` ou `💰 Entrada gratuita` |

**Emojis por tipo de evento:**
- `🎸` show
- `🍜` feira gastronômica
- `🎬` festival de cinema
- `🎨` exposição
- `🎪` festival genérico
- `🎵` outros shows musicais

**Cards clicáveis** — área inteira do card é clicável para ver detalhes (futuro)

### FAB — Botão de Novo Cadastro
- Botão flutuante no canto inferior direito: `+ ✨`
- Sempre visível (position: fixed)
- Abre a Tela 01 (Chat de Cadastro)
- Animação de pulso suave para chamar atenção na primeira visita

---

## Estado Vazio

```
╔══════════════════════════════════════════════════════════╗
║  🎪 event registry                          [🔍] [≡]    ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║                                                          ║
║                    🎪                                    ║
║                                                          ║
║              nenhum evento por aqui ainda                ║
║          que tal cadastrar o primeiro rolê?  🚀          ║
║                                                          ║
║              ╔═══════════════════════════╗               ║
║              ║   + Cadastrar evento       ║               ║
║              ╚═══════════════════════════╝               ║
║                                                          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

## Estados

| Estado | Comportamento |
|--------|---------------|
| **Com eventos** | Cards em lista, ordenados por data |
| **Vazio** | Mensagem encorajadora + botão de cadastro centralizado |
| **Carregando** | Skeleton cards (placeholders animados) |
| **Após novo cadastro** | Novo card aparece no topo com animação de slide-in |
| **Busca ativa** | Lista filtrada, placeholder no input de busca |

---

## Ordenação

| Opção | Critério |
|-------|---------|
| `📅 por data` (padrão) | Data mais próxima primeiro |
| `🔤 por nome` | Alfabética A–Z |
| `🏷️ por tipo` | Agrupado por categoria |

---

## Fluxo de Navegação

```
[Tela 03 — Lista] ──→ [+ ✨ FAB] ──→ [Tela 01 — Chat]
                  ↑
        [← Voltar após confirmação]
                  ↑
        [Tela 02 — Confirmação]
```

---

## Notas para o Frontend

- Dados vêm de `GET /events?order_by=date` — query string para ordenação
- Cada card deve ter `key={event.id}` para animações corretas no React
- O FAB deve fazer scroll suave para o topo e abrir a Tela 01 em overlay ou navegar
- Pré-popular com 3 eventos mock para a demo (ver `docs/regras_de_negocio.md`)
- Após o save na Tela 02, invalidar o cache da lista e refetch
- Cards não precisam de ação de exclusão na versão do protótipo

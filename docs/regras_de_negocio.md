# Regras de Negócio — Event Registry

> Última atualização: 2026-02-26
> Validado com: humano (overseer)

---

## Contexto do Produto

Protótipo para demonstração a cliente final. Objetivo: mostrar que é possível registrar eventos culturais usando linguagem natural de forma confiável, com uma experiência visual jovem e despojada.

**Apresentação:** segunda-feira, 2026-03-02 à noite.

---

## O que é um Evento

Eventos culturais e de entretenimento: shows, feiras gastronômicas, festivais, exposições, etc.

### Campos obrigatórios

| Campo | Tipo | Regra |
|-------|------|-------|
| `nome` | texto | Coletado via chat |
| `tipo` | enum | show, feira gastronômica, festival, exposição, etc. |
| `data` | date | Validação rigorosa — deve ser data futura ou presente |
| `horario_inicio` | time | Validação rigorosa — formato HH:MM |
| `horario_fim` | time | Validação rigorosa — deve ser após horario_inicio |
| `local` | texto | Nome do local e/ou endereço |
| `descricao` | texto | Reescrita pela LLM (ver regra RN-004) |
| `valor_ingresso` | decimal | Validação rigorosa — não pode ser negativo; 0 = gratuito |
| `capacidade` | inteiro | Número máximo de participantes — positivo |
| `organizador` | texto | Nome do organizador ou empresa responsável |

---

## Regras de Negócio

### RN-001 — Coleta via Chat

- A LLM conduz a conversa e coleta os campos do evento de forma conversacional
- A LLM não deve pedir todos os campos de uma vez — deve conduzir naturalmente
- Se o usuário fornecer múltiplos campos em uma mensagem, a LLM deve capturar todos
- A LLM deve confirmar informações ambíguas antes de prosseguir

### RN-002 — Validação de Horários

- Horários devem ser válidos (HH:MM, 00:00–23:59)
- `horario_fim` deve ser posterior ao `horario_inicio`
- Se a data for hoje, o horário não pode ser no passado
- Em caso de inconsistência, a LLM deve questionar o usuário antes de aceitar

### RN-003 — Validação de Valores

- `valor_ingresso` deve ser numérico e não-negativo
- Aceitar formatos: "R$ 50", "50 reais", "cinquenta reais", "gratuito", "free"
- Confirmar o valor com o usuário antes de prosseguir se houver ambiguidade
- Valor 0 ou "gratuito" é válido

### RN-004 — Reescrita da Descrição

- A LLM deve reescrever a descrição fornecida pelo usuário de forma mais empolgante e atrativa
- Manter os fatos originais — apenas melhorar o estilo/tom
- A reescrita deve ser apresentada ao usuário na tela de confirmação para aprovação
- O usuário pode solicitar ajustes na descrição antes de confirmar

### RN-005 — Confirmação Antes de Salvar

- Antes de persistir qualquer evento, mostrar uma tela de confirmação com todos os dados coletados
- O usuário deve explicitamente aprovar o evento
- Na confirmação, destacar: data/hora, valor e descrição reescrita
- Usuário pode voltar e corrigir qualquer campo antes de confirmar

### RN-006 — Listagem de Eventos

- Após o cadastro, o evento aparece na lista de eventos cadastrados
- A lista deve ser acessível a qualquer momento (não só após cadastro)
- Ordenação padrão: data do evento (mais próximo primeiro)

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js (React) |
| Backend | Python (FastAPI) |
| LLM | OpenAI API |
| Observabilidade LLM | Langfuse |
| Banco de dados | PostgreSQL |
| Infraestrutura | Docker Compose |

---

## Dados para Demo

- Usar dados mockados (não reais do cliente)
- Pré-popular a lista com 3–5 eventos de exemplo para a demonstração
- Exemplos sugeridos: show de jazz, feira gastronômica, festival de cinema

---

## Fora do Escopo (v1/protótipo)

- Autenticação de usuários
- Upload de imagens
- Integração com sistemas externos
- Notificações
- Edição/exclusão de eventos já cadastrados

import json

from langfuse.decorators import langfuse_context, observe
from langfuse.openai import OpenAI

_conversation_histories: dict[str, list[dict]] = {}

_openai_client = OpenAI()

CAMPOS_NECESSARIOS = [
    "nome", "tipo", "data", "horario_inicio", "horario_fim",
    "local", "descricao", "valor_ingresso", "capacidade", "organizador"
]

SYSTEM_PROMPT = """\
Você é um assistente de cadastro de eventos culturais. Sua missão é conduzir \
uma conversa natural em português para coletar informações sobre um evento.

CAMPOS NECESSÁRIOS:
- nome: nome do evento
- tipo: tipo (show, feira gastronômica, festival, exposição, etc.)
- data: data do evento (deve ser futura ou hoje, formato YYYY-MM-DD)
- horario_inicio: horário de início (HH:MM, formato 24h)
- horario_fim: horário de fim (HH:MM, deve ser após horario_inicio)
- local: nome e/ou endereço do local
- descricao: descrição do evento fornecida pelo usuário
- valor_ingresso: valor em reais, como número (0 = gratuito)
- capacidade: número máximo de participantes (inteiro positivo)
- organizador: nome do organizador ou empresa

REGRAS DE VALIDAÇÃO:
- data deve ser hoje ou futura (formato YYYY-MM-DD)
- horarios devem ser válidos (00:00 a 23:59)
- horario_fim deve ser posterior ao horario_inicio
- valor_ingresso deve ser numérico não-negativo; aceitar "gratuito", "free", "R$ 50", "50 reais", etc.
- capacidade deve ser inteiro positivo

COMPORTAMENTO:
- Conduza conversa natural e fluida em português
- Não peça todos os campos de uma vez — colete de forma conversacional
- Se o usuário fornecer múltiplos campos em uma mensagem, capture todos
- Valide cada campo e questione se houver inconsistência (ex: horario_fim <= horario_inicio)
- Quando TODOS os campos estiverem coletados e validados, reescreva a "descricao" de \
forma empolgante e atrativa (mantenha os fatos, melhore o tom e o estilo)
- Após reescrever a descrição, sinalize conclusão com is_complete: true

RESPOSTA:
Responda SEMPRE com um objeto JSON válido, sem markdown, com esta estrutura exata:
{
  "message": "mensagem de chat para o usuário",
  "extracted_data": {},
  "is_complete": false
}

- "message": o que você quer dizer ao usuário
- "extracted_data": apenas os campos novos ou atualizados nesta interação \
(campos não alterados ficam fora deste objeto)
- "is_complete": true SOMENTE quando todos os 10 campos estiverem coletados e validados \
e a descricao tiver sido reescrita

ESTADO ATUAL DOS CAMPOS (já coletados — null = ainda não coletado):
{state_json}
"""


def _build_system_prompt(current_data: dict) -> str:
    state = {k: current_data.get(k) for k in CAMPOS_NECESSARIOS}
    return SYSTEM_PROMPT.format(state_json=json.dumps(state, ensure_ascii=False, indent=2))


def _parse_llm_response(content: str) -> dict:
    """Extract JSON from LLM response, handling markdown code blocks."""
    text = content.strip()
    if text.startswith("```"):
        lines = text.split("\n")
        lines = [l for l in lines if not l.startswith("```")]
        text = "\n".join(lines).strip()
    return json.loads(text)


def _merge_event_data(current: dict, extracted: dict) -> dict:
    merged = dict(current)
    for k, v in extracted.items():
        if k in CAMPOS_NECESSARIOS and v is not None:
            merged[k] = v
    return merged


def _all_fields_present(data: dict) -> bool:
    return all(data.get(f) is not None for f in CAMPOS_NECESSARIOS)


@observe(name="chat-session")
def process_chat(session_id: str, message: str, current_event_data: dict) -> dict:
    langfuse_context.update_current_trace(
        session_id=session_id,
        name=f"chat-{session_id}",
    )

    history = _conversation_histories.setdefault(session_id, [])

    system_prompt = _build_system_prompt(current_event_data)

    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history)
    messages.append({"role": "user", "content": message})

    response = _openai_client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        response_format={"type": "json_object"},
        temperature=0.7,
        name="event-chat-completion",
    )

    raw_content = response.choices[0].message.content
    parsed = _parse_llm_response(raw_content)

    ai_message = parsed.get("message", "")
    extracted_data = parsed.get("extracted_data", {})
    is_complete = bool(parsed.get("is_complete", False))

    history.append({"role": "user", "content": message})
    history.append({"role": "assistant", "content": raw_content})

    updated_event_data = _merge_event_data(current_event_data, extracted_data)

    if is_complete and _all_fields_present(updated_event_data):
        status = "ready_to_confirm"
    else:
        status = "collecting"

    return {
        "message": ai_message,
        "current_event_data": updated_event_data,
        "status": status,
    }

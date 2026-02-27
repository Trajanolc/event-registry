from datetime import date, time, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, Field, model_validator


class EventoBase(BaseModel):
    nome: str = Field(..., min_length=1, max_length=255)
    tipo: str = Field(..., min_length=1, max_length=100)
    data: date
    horario_inicio: time
    horario_fim: time
    local: str = Field(..., min_length=1, max_length=255)
    descricao: str
    valor_ingresso: Decimal = Field(..., ge=0, decimal_places=2)
    capacidade: int = Field(..., gt=0)
    organizador: str = Field(..., min_length=1, max_length=255)


class EventoCreate(EventoBase):
    @model_validator(mode="after")
    def validate_horarios_e_data(self) -> "EventoCreate":
        hoje = date.today()
        agora = datetime.now().time()

        if self.data < hoje:
            raise ValueError(
                f"A data do evento ({self.data}) não pode ser no passado."
            )

        if self.horario_fim <= self.horario_inicio:
            raise ValueError(
                f"horario_fim ({self.horario_fim}) deve ser posterior ao horario_inicio ({self.horario_inicio})."
            )

        if self.data == hoje and self.horario_inicio < agora:
            raise ValueError(
                f"Para eventos hoje ({hoje}), o horario_inicio ({self.horario_inicio}) não pode ser no passado "
                f"(agora são {agora.strftime('%H:%M')})."
            )

        return self


class EventoResponse(EventoBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}


class CurrentEventData(BaseModel):
    nome: Optional[str] = None
    tipo: Optional[str] = None
    data: Optional[str] = None
    horario_inicio: Optional[str] = None
    horario_fim: Optional[str] = None
    local: Optional[str] = None
    descricao: Optional[str] = None
    valor_ingresso: Optional[str] = None
    capacidade: Optional[int] = None
    organizador: Optional[str] = None


class ChatRequest(BaseModel):
    session_id: str
    message: str
    current_event_data: CurrentEventData = Field(default_factory=CurrentEventData)


class ChatResponse(BaseModel):
    message: str
    current_event_data: CurrentEventData
    status: str

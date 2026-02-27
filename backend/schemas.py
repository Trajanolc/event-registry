from datetime import date, time, datetime
from decimal import Decimal
from pydantic import BaseModel, Field


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
    pass


class EventoResponse(EventoBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

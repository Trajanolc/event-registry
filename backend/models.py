from datetime import date, time, datetime
from decimal import Decimal
from sqlalchemy import String, Date, Time, Numeric, Integer, Text, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class Evento(Base):
    __tablename__ = "eventos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    nome: Mapped[str] = mapped_column(String(255), nullable=False)
    tipo: Mapped[str] = mapped_column(String(100), nullable=False)
    data: Mapped[date] = mapped_column(Date, nullable=False)
    horario_inicio: Mapped[time] = mapped_column(Time, nullable=False)
    horario_fim: Mapped[time] = mapped_column(Time, nullable=False)
    local: Mapped[str] = mapped_column(String(255), nullable=False)
    descricao: Mapped[str] = mapped_column(Text, nullable=False)
    valor_ingresso: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    capacidade: Mapped[int] = mapped_column(Integer, nullable=False)
    organizador: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

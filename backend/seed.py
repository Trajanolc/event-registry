"""Seed script — populate database with demo events."""
from datetime import date, time
from decimal import Decimal
from database import SessionLocal
from models import Evento


DEMO_EVENTS = [
    {
        "nome": "Jazz no Parque",
        "tipo": "show",
        "data": date(2026, 3, 15),
        "horario_inicio": time(18, 0),
        "horario_fim": time(22, 0),
        "local": "Parque Ibirapuera — Palco das Cerejeiras, São Paulo",
        "descricao": "Uma noite especial com os melhores músicos de jazz da cidade. Traga sua cadeira e relaxe ao som de clássicos e composições autorais.",
        "valor_ingresso": Decimal("35.00"),
        "capacidade": 500,
        "organizador": "Fundação Parque Ibirapuera",
    },
    {
        "nome": "Feira Gastronômica Sabores do Brasil",
        "tipo": "feira",
        "data": date(2026, 3, 22),
        "horario_inicio": time(10, 0),
        "horario_fim": time(20, 0),
        "local": "Mercado Municipal de São Paulo",
        "descricao": "Reúne mais de 40 produtores artesanais de todo o Brasil com queijos, embutidos, cervejas artesanais, doces e muito mais. Entrada gratuita.",
        "valor_ingresso": Decimal("0.00"),
        "capacidade": 2000,
        "organizador": "ABRASEL São Paulo",
    },
    {
        "nome": "Festival de Cinema Independente",
        "tipo": "festival",
        "data": date(2026, 4, 5),
        "horario_inicio": time(14, 0),
        "horario_fim": time(23, 30),
        "local": "Cine Belas Artes, São Paulo",
        "descricao": "Três dias de cinema independente nacional e internacional. Sessões, debates com diretores e mostras temáticas sobre o futuro do audiovisual.",
        "valor_ingresso": Decimal("25.00"),
        "capacidade": 300,
        "organizador": "Coletivo Cinema Livre",
    },
    {
        "nome": "Exposição Fotográfica: Cidades Invisíveis",
        "tipo": "exposição",
        "data": date(2026, 4, 10),
        "horario_inicio": time(9, 0),
        "horario_fim": time(18, 0),
        "local": "Centro Cultural FIESP, São Paulo",
        "descricao": "Série fotográfica que revela os contrastes e silêncios das metrópoles brasileiras. Curadoria de Ana Lima com obras de 12 fotógrafos independentes.",
        "valor_ingresso": Decimal("15.00"),
        "capacidade": 150,
        "organizador": "Ana Lima Fotografia",
    },
    {
        "nome": "Sarau Literário Palavras Soltas",
        "tipo": "sarau",
        "data": date(2026, 4, 18),
        "horario_inicio": time(19, 30),
        "horario_fim": time(22, 30),
        "local": "Livraria Cultura — Conjunto Nacional, São Paulo",
        "descricao": "Noite de poesia, crônicas e contos. Palco aberto para quem quiser ler. Venha ouvir, ou venha falar — todos são bem-vindos.",
        "valor_ingresso": Decimal("10.00"),
        "capacidade": 80,
        "organizador": "Coletivo Palavras Soltas",
    },
]


def seed():
    db = SessionLocal()
    try:
        existing = db.query(Evento).count()
        if existing > 0:
            print(f"Banco já possui {existing} evento(s). Pulando seed.")
            return

        for data in DEMO_EVENTS:
            evento = Evento(**data)
            db.add(evento)

        db.commit()
        print(f"Seed completo: {len(DEMO_EVENTS)} eventos criados.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()

from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Evento
from schemas import EventoCreate, EventoResponse, ChatRequest, ChatResponse
from chat import process_chat


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migrations and seed on startup
    import subprocess
    subprocess.run(["alembic", "upgrade", "head"], check=True)
    from seed import seed
    seed()
    yield


app = FastAPI(title="Event Registry API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/eventos", response_model=List[EventoResponse])
def list_eventos(db: Session = Depends(get_db)):
    return db.query(Evento).order_by(Evento.data, Evento.horario_inicio).all()


@app.post("/eventos", response_model=EventoResponse, status_code=201)
def create_evento(evento: EventoCreate, db: Session = Depends(get_db)):
    db_evento = Evento(**evento.model_dump())
    db.add(db_evento)
    db.commit()
    db.refresh(db_evento)
    return db_evento


@app.get("/eventos/{evento_id}", response_model=EventoResponse)
def get_evento(evento_id: int, db: Session = Depends(get_db)):
    evento = db.query(Evento).filter(Evento.id == evento_id).first()
    if not evento:
        raise HTTPException(status_code=404, detail="Evento não encontrado")
    return evento


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        result = process_chat(
            session_id=request.session_id,
            message=request.message,
            current_event_data=request.current_event_data.model_dump(exclude_none=False),
        )
        return ChatResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

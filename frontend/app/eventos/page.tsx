"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Evento {
  id: number;
  nome: string;
  tipo: string;
  data: string;
  horario_inicio: string;
  horario_fim: string;
  local: string;
  descricao: string;
  valor_ingresso: number;
  capacidade: number;
  organizador: string;
  created_at: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DIAS_CURTOS: Record<number, string> = {
  0: "Dom", 1: "Seg", 2: "Ter", 3: "Qua",
  4: "Qui", 5: "Sex", 6: "Sáb",
};

const MESES: Record<number, string> = {
  0: "jan", 1: "fev", 2: "mar", 3: "abr", 4: "mai", 5: "jun",
  6: "jul", 7: "ago", 8: "set", 9: "out", 10: "nov", 11: "dez",
};

function formatarDataCurta(dataStr: string): string {
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  const d = new Date(ano, mes - 1, dia);
  return `${DIAS_CURTOS[d.getDay()]}, ${String(dia).padStart(2, "0")} ${MESES[mes - 1]}`;
}

function formatarHora(hora: string): string {
  return hora.slice(0, 5).replace(":", "h");
}

function formatarValor(valor: number): string {
  if (!valor || valor === 0) return "Entrada gratuita";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
}

function getTipoEmoji(tipo: string): string {
  const t = tipo.toLowerCase();
  if (t.includes("show") || t.includes("música") || t.includes("musica") || t.includes("concerto")) return "🎸";
  if (t.includes("feira") || t.includes("gastro") || t.includes("comida")) return "🍜";
  if (t.includes("cinema") || t.includes("filme")) return "🎬";
  if (t.includes("festival")) return "🎪";
  if (t.includes("exposi") || t.includes("arte") || t.includes("galeria")) return "🎨";
  if (t.includes("teatro")) return "🎭";
  return "🎵";
}

type Ordenacao = "data" | "nome" | "tipo";

function ordenarEventos(eventos: Evento[], por: Ordenacao): Evento[] {
  return [...eventos].sort((a, b) => {
    if (por === "data") {
      const diff = a.data.localeCompare(b.data);
      return diff !== 0 ? diff : a.horario_inicio.localeCompare(b.horario_inicio);
    }
    if (por === "nome") return a.nome.localeCompare(b.nome);
    if (por === "tipo") return a.tipo.localeCompare(b.tipo);
    return 0;
  });
}

const s = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    background: "var(--bg)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.5rem",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
  },
  logo: {
    fontSize: "1.1rem",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
  headerIcons: {
    display: "flex",
    gap: "0.75rem",
    color: "var(--muted)",
    fontSize: "1.1rem",
  },
  main: {
    flex: 1,
    padding: "1.5rem",
    maxWidth: 640,
    width: "100%",
    margin: "0 auto",
    paddingBottom: "5rem",
  },
  barra: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1.25rem",
  },
  barraLabel: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "var(--text)",
  },
  barraContador: {
    color: "var(--muted)",
    fontWeight: 400,
    fontSize: "0.9rem",
    marginLeft: "0.5rem",
  },
  select: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: "var(--radius-sm)",
    padding: "0.35rem 0.65rem",
    fontSize: "0.85rem",
    cursor: "pointer",
    outline: "none",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "1.1rem 1.25rem",
    marginBottom: "0.85rem",
    cursor: "pointer",
    transition: "border-color 0.15s",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.4rem",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "0.5rem",
  },
  cardNome: {
    fontSize: "1rem",
    fontWeight: 700,
    flex: 1,
  },
  cardTipoTag: {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    borderRadius: "6px",
    padding: "0.15rem 0.55rem",
    fontSize: "0.75rem",
    whiteSpace: "nowrap" as const,
  },
  cardInfo: {
    color: "var(--muted)",
    fontSize: "0.88rem",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "0.25rem 0",
  },
  cardInfoRow: {
    display: "flex",
    gap: "0.4rem",
    alignItems: "center",
  },
  cardValorRow: {
    display: "flex",
    gap: "1rem",
    color: "var(--muted)",
    fontSize: "0.88rem",
  },
  skeleton: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "1.1rem 1.25rem",
    marginBottom: "0.85rem",
    height: 100,
    opacity: 0.5,
  },
  vazio: {
    textAlign: "center" as const,
    padding: "5rem 2rem",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "1rem",
  },
  vazioEmoji: {
    fontSize: "3rem",
  },
  vazioTitulo: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "var(--text)",
  },
  vazioSub: {
    color: "var(--muted)",
    fontSize: "0.9rem",
  },
  btnVazio: {
    background: "var(--primary)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "0.75rem 1.5rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "0.5rem",
  },
  fab: {
    position: "fixed" as const,
    bottom: "1.75rem",
    right: "1.75rem",
    background: "var(--primary)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: 56,
    height: 56,
    fontSize: "1.4rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
  },
};

export default function EventosPage() {
  const router = useRouter();
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("data");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/eventos`)
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao carregar eventos");
        return r.json();
      })
      .then((dados) => setEventos(dados))
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false));
  }, []);

  const listaOrdenada = ordenarEventos(eventos, ordenacao);

  function irParaChat() {
    router.push("/chat");
  }

  return (
    <div style={s.container}>
      <header style={s.header}>
        <span style={s.logo}>🎪 event registry</span>
        <div style={s.headerIcons}>
          <span>🔍</span>
          <span>≡</span>
        </div>
      </header>

      <main style={s.main}>
        {/* Barra de contexto */}
        <div style={s.barra}>
          <span style={s.barraLabel}>
            rolês na área
            {!carregando && (
              <span style={s.barraContador}>({eventos.length} eventos)</span>
            )}
          </span>
          <select
            style={s.select}
            value={ordenacao}
            onChange={(e) => setOrdenacao(e.target.value as Ordenacao)}
          >
            <option value="data">📅 por data</option>
            <option value="nome">🔤 por nome</option>
            <option value="tipo">🏷️ por tipo</option>
          </select>
        </div>

        {/* Estado de erro */}
        {erro && (
          <div
            style={{
              background: "#2a0a0a",
              border: "1px solid #7f1d1d",
              color: "#fca5a5",
              borderRadius: "var(--radius-sm)",
              padding: "0.75rem 1rem",
              fontSize: "0.9rem",
              marginBottom: "1rem",
            }}
          >
            ⚠️ {erro}
          </div>
        )}

        {/* Esqueletos de carregamento */}
        {carregando &&
          [1, 2, 3].map((i) => <div key={i} style={s.skeleton} />)}

        {/* Estado vazio */}
        {!carregando && !erro && eventos.length === 0 && (
          <div style={s.vazio}>
            <span style={s.vazioEmoji}>🎪</span>
            <p style={s.vazioTitulo}>nenhum evento por aqui ainda</p>
            <p style={s.vazioSub}>que tal cadastrar o primeiro rolê? 🚀</p>
            <button style={s.btnVazio} onClick={irParaChat}>
              + Cadastrar evento
            </button>
          </div>
        )}

        {/* Lista de eventos */}
        {!carregando &&
          listaOrdenada.map((evento) => (
            <div key={evento.id} style={s.card}>
              <div style={s.cardTop}>
                <span style={s.cardNome}>
                  {getTipoEmoji(evento.tipo)} {evento.nome}
                </span>
                <span style={s.cardTipoTag}>{evento.tipo}</span>
              </div>

              <div style={s.cardInfoRow}>
                <span>📅 {formatarDataCurta(evento.data)}</span>
                <span style={{ color: "var(--border)" }}>·</span>
                <span>
                  🕗 {formatarHora(evento.horario_inicio)} –{" "}
                  {formatarHora(evento.horario_fim)}
                </span>
              </div>

              <div style={s.cardInfoRow}>
                <span>📍 {evento.local}</span>
              </div>

              <div style={s.cardValorRow}>
                <span>💰 {formatarValor(evento.valor_ingresso)}</span>
                <span>👥 {evento.capacidade} vagas</span>
              </div>
            </div>
          ))}
      </main>

      {/* FAB */}
      <button style={s.fab} onClick={irParaChat} title="Novo evento">
        ✨
      </button>
    </div>
  );
}

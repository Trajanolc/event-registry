"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface EventoRascunho {
  nome: string;
  tipo: string;
  data: string;
  horario_inicio: string;
  horario_fim: string;
  local: string;
  descricao: string;
  descricao_turbinada?: string;
  valor_ingresso: number;
  capacidade: number;
  organizador: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DIAS: Record<number, string> = {
  0: "Domingo", 1: "Segunda", 2: "Terça", 3: "Quarta",
  4: "Quinta", 5: "Sexta", 6: "Sábado",
};

const MESES: Record<number, string> = {
  0: "jan", 1: "fev", 2: "mar", 3: "abr", 4: "mai", 5: "jun",
  6: "jul", 7: "ago", 8: "set", 9: "out", 10: "nov", 11: "dez",
};

function formatarData(dataStr: string): string {
  const [ano, mes, dia] = dataStr.split("-").map(Number);
  const d = new Date(ano, mes - 1, dia);
  return `${DIAS[d.getDay()]}, ${String(dia).padStart(2, "0")} ${MESES[mes - 1]} ${ano}`;
}

function formatarHora(hora: string): string {
  return hora.slice(0, 5).replace(":", "h");
}

function formatarValor(valor: number): string {
  if (!valor || valor === 0) return "Entrada gratuita";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
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
  btnBack: {
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    borderRadius: "var(--radius-sm)",
    padding: "0.4rem 0.9rem",
    fontSize: "0.85rem",
    cursor: "pointer",
  },
  main: {
    flex: 1,
    padding: "1.5rem",
    maxWidth: 600,
    width: "100%",
    margin: "0 auto",
    paddingBottom: "6rem",
  },
  subtitle: {
    color: "var(--muted)",
    fontSize: "0.95rem",
    marginBottom: "1.5rem",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  cardHeader: {
    borderBottom: "1px solid var(--border)",
    paddingBottom: "1rem",
  },
  nomeEvento: {
    fontSize: "1.3rem",
    fontWeight: 700,
    marginBottom: "0.25rem",
  },
  tipoLocal: {
    color: "var(--muted)",
    fontSize: "0.9rem",
  },
  blocoDestaque: {
    background: "var(--accent-light)",
    border: "1px solid rgba(245,166,35,0.3)",
    borderRadius: "var(--radius-sm)",
    padding: "0.85rem 1rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.3rem",
    fontSize: "0.95rem",
  },
  blocoValor: {
    background: "var(--green-light)",
    border: "1px solid rgba(34,197,94,0.3)",
    borderRadius: "var(--radius-sm)",
    padding: "0.85rem 1rem",
    fontSize: "0.95rem",
  },
  dadosExtra: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.3rem",
    color: "var(--text)",
    fontSize: "0.9rem",
  },
  separador: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    color: "var(--muted)",
    fontSize: "0.8rem",
  },
  separadorLinha: {
    flex: 1,
    height: 1,
    background: "var(--border)",
  },
  descricaoTurbinada: {
    color: "var(--text)",
    fontSize: "0.9rem",
    fontStyle: "italic" as const,
    lineHeight: 1.7,
  },
  btnAjuste: {
    background: "none",
    border: "none",
    color: "var(--muted)",
    fontSize: "0.85rem",
    cursor: "pointer",
    alignSelf: "flex-end" as const,
    padding: "0.25rem 0",
    textDecoration: "underline",
  },
  miniChat: {
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.6rem",
  },
  miniChatRow: {
    display: "flex",
    gap: "0.5rem",
  },
  miniChatInput: {
    flex: 1,
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    padding: "0.5rem 0.75rem",
    fontSize: "0.9rem",
    outline: "none",
  },
  miniChatSend: {
    background: "var(--primary)",
    color: "#fff",
    border: "none",
    borderRadius: "var(--radius-sm)",
    padding: "0.5rem 0.9rem",
    fontSize: "0.9rem",
    cursor: "pointer",
  },
  textareaEdit: {
    background: "var(--bg)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text)",
    padding: "0.6rem 0.75rem",
    fontSize: "0.85rem",
    resize: "vertical" as const,
    width: "100%",
    outline: "none",
  },
  fecharBtn: {
    background: "none",
    border: "none",
    color: "var(--muted)",
    fontSize: "0.8rem",
    cursor: "pointer",
    textDecoration: "underline",
    padding: 0,
    alignSelf: "flex-end" as const,
  },
  erro: {
    background: "#2a0a0a",
    border: "1px solid #7f1d1d",
    color: "#fca5a5",
    borderRadius: "var(--radius-sm)",
    padding: "0.75rem 1rem",
    fontSize: "0.9rem",
    marginTop: "1rem",
  },
  footer: {
    position: "fixed" as const,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    gap: "0.75rem",
    padding: "1rem 1.5rem",
    background: "var(--surface)",
    borderTop: "1px solid var(--border)",
  },
  btnSecondary: {
    flex: 1,
    background: "none",
    border: "1px solid var(--border)",
    color: "var(--text)",
    borderRadius: "var(--radius-sm)",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  btnPrimary: {
    flex: 2,
    background: "var(--primary)",
    border: "none",
    color: "#fff",
    borderRadius: "var(--radius-sm)",
    padding: "0.75rem 1rem",
    fontSize: "0.95rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  semDados: {
    textAlign: "center" as const,
    padding: "4rem 2rem",
    color: "var(--muted)",
  },
};

export default function ConfirmarPage() {
  const router = useRouter();
  const [evento, setEvento] = useState<EventoRascunho | null>(null);
  const [descricao, setDescricao] = useState("");
  const [mostrarAjuste, setMostrarAjuste] = useState(false);
  const [pedidoAjuste, setPedidoAjuste] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("eventoRascunho");
    if (raw) {
      const dados: EventoRascunho = JSON.parse(raw);
      setEvento(dados);
      setDescricao(dados.descricao_turbinada || dados.descricao || "");
    }
  }, []);

  async function handleConfirmar() {
    if (!evento) return;
    setSalvando(true);
    setErro(null);
    try {
      const payload = {
        nome: evento.nome,
        tipo: evento.tipo,
        data: evento.data,
        horario_inicio: evento.horario_inicio + ":00",
        horario_fim: evento.horario_fim + ":00",
        local: evento.local,
        descricao: descricao,
        valor_ingresso: evento.valor_ingresso,
        capacidade: evento.capacidade,
        organizador: evento.organizador,
      };
      const resp = await fetch(`${API_URL}/eventos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(
          typeof err.detail === "string"
            ? err.detail
            : JSON.stringify(err.detail)
        );
      }
      localStorage.removeItem("eventoRascunho");
      router.push("/eventos");
    } catch (e: unknown) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar evento");
    } finally {
      setSalvando(false);
    }
  }

  function handleVoltar() {
    router.push("/chat");
  }

  if (!evento) {
    return (
      <div style={s.container}>
        <header style={s.header}>
          <span style={s.logo}>🎪 event registry</span>
        </header>
        <div style={s.semDados}>
          <p style={{ marginBottom: "1rem" }}>Nenhum evento para confirmar.</p>
          <button style={s.btnSecondary} onClick={() => router.push("/chat")}>
            ← Ir para o chat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <header style={s.header}>
        <span style={s.logo}>🎪 event registry</span>
        <button style={s.btnBack} onClick={handleVoltar}>
          ← Chat
        </button>
      </header>

      <main style={s.main}>
        <p style={s.subtitle}>Confere se tá tudo certo antes de salvar 👀</p>

        <div style={s.card}>
          {/* Cabeçalho do card */}
          <div style={s.cardHeader}>
            <h2 style={s.nomeEvento}>
              {getTipoEmoji(evento.tipo)} {evento.nome}
            </h2>
            <p style={s.tipoLocal}>
              {evento.tipo} · {evento.local}
            </p>
          </div>

          {/* Bloco destacado: Data/Hora */}
          <div style={s.blocoDestaque}>
            <div>📅 {formatarData(evento.data)}</div>
            <div>
              🕗 {formatarHora(evento.horario_inicio)} –{" "}
              {formatarHora(evento.horario_fim)}
            </div>
          </div>

          {/* Bloco destacado: Valor */}
          <div style={s.blocoValor}>
            💰 {formatarValor(evento.valor_ingresso)}
          </div>

          {/* Dados complementares */}
          <div style={s.dadosExtra}>
            <div>👥 Capacidade: {evento.capacidade} pessoas</div>
            <div>🏢 Organizador: {evento.organizador}</div>
          </div>

          {/* Separador descrição turbinada */}
          <div style={s.separador}>
            <div style={s.separadorLinha} />
            <span>versão turbinada ✨</span>
            <div style={s.separadorLinha} />
          </div>

          {/* Descrição turbinada */}
          <p style={s.descricaoTurbinada}>{descricao}</p>

          {/* Mini-chat de ajuste */}
          {mostrarAjuste ? (
            <div style={s.miniChat}>
              <div style={s.miniChatRow}>
                <input
                  style={s.miniChatInput}
                  placeholder="O que você quer ajustar?"
                  value={pedidoAjuste}
                  onChange={(e) => setPedidoAjuste(e.target.value)}
                />
                <button style={s.miniChatSend}>→</button>
              </div>
              <textarea
                style={s.textareaEdit}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                placeholder="Edite a descrição diretamente..."
              />
              <button
                style={s.fecharBtn}
                onClick={() => {
                  setMostrarAjuste(false);
                  setPedidoAjuste("");
                }}
              >
                Fechar
              </button>
            </div>
          ) : (
            <button
              style={s.btnAjuste}
              onClick={() => setMostrarAjuste(true)}
            >
              ✏️ Pedir ajuste
            </button>
          )}
        </div>

        {erro && <div style={s.erro}>⚠️ {erro}</div>}
      </main>

      {/* Footer fixo com botões de ação */}
      <div style={s.footer}>
        <button style={s.btnSecondary} onClick={handleVoltar}>
          ← Voltar e Ajustar
        </button>
        <button
          style={{
            ...s.btnPrimary,
            opacity: salvando ? 0.7 : 1,
          }}
          onClick={handleConfirmar}
          disabled={salvando}
        >
          {salvando ? "Salvando..." : "Confirmar e Salvar ✓"}
        </button>
      </div>
    </div>
  );
}

function getTipoEmoji(tipo: string): string {
  const t = tipo.toLowerCase();
  if (t.includes("show") || t.includes("música") || t.includes("musica") || t.includes("concerto")) return "🎸";
  if (t.includes("feira") || t.includes("gastro") || t.includes("comida")) return "🍜";
  if (t.includes("cinema") || t.includes("filme") || t.includes("festival")) return "🎬";
  if (t.includes("exposi") || t.includes("arte") || t.includes("galeria")) return "🎨";
  if (t.includes("teatro")) return "🎭";
  return "🎵";
}

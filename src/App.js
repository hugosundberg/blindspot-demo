import { useState } from "react";
import {
  Splash, JoinGame, Lobby, PackSelect, Countdown,
  ReadPhase, TradePhase, AnswerPhase, RoundResult,
  StealSequence, PoisonReveal, Leaderboard,
} from "./components/screens";
import { ROUNDS_DATA, PLAYERS_DATA } from "./data/constants";

/* ─────────────────────────────────────────────
   FLOW
   Each string is a unique screen key.
   "join" is only entered via the Join path on Splash.
───────────────────────────────────────────── */
const FLOW = [
  "splash",
  "lobby", "pack", "countdown",
  "r1_read", "r1_trade", "r1_answer", "r1_result",
  "r2_read", "r2_trade", "r2_steal",
  "r3_read", "r3_trade", "r3_answer", "r3_poison",
  "leaderboard",
];

const SECTIONS = [
  { label: "Setup",              steps: ["splash","lobby","pack","countdown"] },
  { label: "Round 1",            steps: ["r1_read","r1_trade","r1_answer","r1_result"] },
  { label: "Round 2 — Steal",    steps: ["r2_read","r2_trade","r2_steal"] },
  { label: "Round 3 — Poison",   steps: ["r3_read","r3_trade","r3_answer","r3_poison"] },
  { label: "Results",            steps: ["leaderboard"] },
];

export default function App() {
  const [step, setStep]   = useState(0);
  const [chips, setChips] = useState(10);
  const [joinFlow, setJoinFlow] = useState(false); // true when user chose "Join with code"

  const screen  = joinFlow ? "join" : FLOW[step];
  const next    = () => setStep(s => Math.min(s + 1, FLOW.length - 1));
  const jumpTo  = (name) => { const idx = FLOW.indexOf(name); if (idx >= 0) setStep(idx); };
  const restart = () => { setStep(0); setChips(10); setJoinFlow(false); };

  const renderScreen = () => {
    switch (screen) {
      case "splash":    return <Splash onNext={next} onJoin={() => setJoinFlow(true)} />;
      case "join":      return <JoinGame onJoin={() => { setJoinFlow(false); jumpTo("lobby"); }} onBack={() => setJoinFlow(false)} />;
      case "lobby":     return <Lobby onNext={next} />;
      case "pack":      return <PackSelect onNext={next} />;
      case "countdown": return <Countdown onNext={next} />;

      case "r1_read":   return <ReadPhase round={ROUNDS_DATA[0]} chips={chips} onNext={next} />;
      case "r1_trade":  return <TradePhase round={ROUNDS_DATA[0]} chips={chips} showIncoming onAnswer={next} onSteal={() => jumpTo("r1_answer")} />;
      case "r1_answer": return (
        <AnswerPhase round={ROUNDS_DATA[0]} chips={chips} correctAnswer="Pluto"
          onSubmit={(correct) => { if (correct) setChips(c => c + 5); else if (correct === false) setChips(c => c - 2); next(); }}
        />
      );
      case "r1_result": return <RoundResult round={ROUNDS_DATA[0]} correct chips={chips} chipDelta={5} onNext={next} />;

      case "r2_read":   return <ReadPhase round={ROUNDS_DATA[1]} chips={chips} onNext={next} />;
      case "r2_trade":  return <TradePhase round={ROUNDS_DATA[1]} chips={chips} onAnswer={next} onSteal={next} />;
      case "r2_steal":  return <StealSequence round={ROUNDS_DATA[1]} stealer={PLAYERS_DATA[2]} onNext={() => { setChips(c => c - 1); next(); }} />;

      case "r3_read":   return <ReadPhase round={ROUNDS_DATA[2]} chips={chips} onNext={next} />;
      case "r3_trade":  return <TradePhase round={ROUNDS_DATA[2]} chips={chips} onAnswer={next} onSteal={() => jumpTo("r3_answer")} />;
      case "r3_answer": return (
        <AnswerPhase round={ROUNDS_DATA[2]} chips={chips} correctAnswer="Taylor Swift"
          onSubmit={(correct) => { if (correct === false) setChips(c => c - 2); next(); }}
        />
      );
      case "r3_poison": return <PoisonReveal round={ROUNDS_DATA[2]} chips={chips} onNext={next} />;

      case "leaderboard": return <Leaderboard onRestart={restart} />;
      default:            return <Splash onNext={next} onJoin={() => setJoinFlow(true)} />;
    }
  };

  const currentSection = SECTIONS.findIndex(s => s.steps.includes(screen));

  return (
    <div style={{
      minHeight: "100vh", background: "#050506", fontFamily: "var(--fb)",
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: 16, paddingBottom: 16,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--fd)", fontSize: 22, letterSpacing: 6, color: "#DC2626", textShadow: "0 0 20px rgba(220,38,38,0.3)" }}>BLINDSPOT</span>
        <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "#44444F", letterSpacing: 2, border: "1px solid #2A2A32", padding: "2px 8px", borderRadius: 4 }}>DEMO</span>
      </div>

      {/* Section nav */}
      <div style={{ display: "flex", gap: 3, marginBottom: 6, flexWrap: "wrap", justifyContent: "center", maxWidth: 400, padding: "0 12px" }}>
        {SECTIONS.map((s, i) => (
          <div key={s.label} onClick={() => jumpTo(s.steps[0])} style={{
            padding: "4px 10px", borderRadius: 6, cursor: "pointer",
            background: i === currentSection ? "var(--red)" : "#111114",
            border: `1px solid ${i === currentSection ? "var(--red)" : "#2A2A32"}`,
            fontSize: 10, fontFamily: "'Outfit',sans-serif",
            color: i === currentSection ? "white" : "#6B6B76",
            fontWeight: i === currentSection ? 600 : 400, letterSpacing: .3, transition: "all 0.2s",
          }}>{s.label}</div>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ display: "flex", gap: 2, marginBottom: 16, maxWidth: 390, width: "100%", padding: "0 12px" }}>
        {FLOW.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 2, borderRadius: 1, background: i <= step ? "var(--red)" : "#2A2A32", transition: "background 0.3s" }} />
        ))}
      </div>

      {/* Screen */}
      <div key={screen} style={{ width: 390, height: 760, flexShrink: 0 }}>
        {renderScreen()}
      </div>

      <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#44444F", letterSpacing: 1, textAlign: "center", padding: "0 20px" }}>
        NAVIGATE VIA SECTION TABS OR IN-APP BUTTONS • {step + 1}/{FLOW.length}
      </div>
    </div>
  );
}

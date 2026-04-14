import { useState, useEffect } from "react";
import { Phone, Avatar, Btn } from "../ui";
import { PLAYERS_DATA } from "../../data/constants";

export default function StealSequence({ round, stealer, onNext }) {
  const [phase, setPhase] = useState("flash");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("countdown"), 900);
    const t2 = setTimeout(() => setPhase("typing"),    2800);
    const t3 = setTimeout(() => setPhase("result"),    4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <Phone flash={phase === "flash" ? "var(--red)" : null}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 50% 40%, var(--red-gs) 0%, transparent 60%)",
          opacity: phase === "flash" || phase === "countdown" ? .7 : .3, transition: "opacity 0.5s",
        }} />

        {phase === "flash" && (
          <div style={{ animation: "scaleIn 0.4s ease-out", textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "var(--fd)", fontSize: 56, color: "var(--red)", letterSpacing: 8, textShadow: "0 0 40px var(--red-gs)" }}>⚡ STEAL</div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 12, color: "var(--txt-m)", marginTop: 8, letterSpacing: 2 }}>{stealer.name.toUpperCase()} IS ATTEMPTING A STEAL</div>
          </div>
        )}

        {phase === "countdown" && (
          <div style={{ textAlign: "center", animation: "scaleIn 0.3s ease-out", position: "relative", zIndex: 1 }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", border: "3px solid var(--red)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", animation: "pulseRed 1s ease-in-out infinite" }}>
              <span style={{ fontFamily: "var(--fd)", fontSize: 52, color: "var(--red)", animation: "countPulse 1s ease-in-out infinite" }}>12</span>
            </div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2 }}>SECONDS REMAINING</div>
            <div style={{ marginTop: 24, display: "flex", gap: 12, justifyContent: "center" }}>
              {PLAYERS_DATA.filter(p => p.id !== stealer.id).map(p => (
                <div key={p.id} style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--s1)", border: "1.5px solid var(--bdr)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontSize: 14, color: "var(--txt-d)", animation: "stealFlash 0.8s ease-in-out infinite" }}>{p.av}</div>
              ))}
            </div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--txt-d)", marginTop: 8 }}>ALL TRADES FROZEN</div>
          </div>
        )}

        {phase === "typing" && (
          <div style={{ textAlign: "center", animation: "fadeIn 0.3s ease-out", width: "100%", position: "relative", zIndex: 1 }}>
            <Avatar player={stealer} size={64} glow />
            <div style={{ fontSize: 14, color: "var(--txt-m)", marginTop: 12, marginBottom: 24 }}>{stealer.name} is typing...</div>
            <div style={{ background: "var(--s1)", border: "1.5px solid var(--bdr)", borderRadius: 12, padding: "16px 20px", margin: "0 20px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--txt-d)", animation: `pulse 1.2s ease-in-out ${i * .3}s infinite` }} />)}
              </div>
              <span style={{ fontFamily: "var(--fm)", fontSize: 12, color: "var(--txt-d)" }}>answer locked</span>
            </div>
          </div>
        )}

        {phase === "result" && (
          <div style={{ textAlign: "center", animation: "scaleIn 0.4s ease-out", width: "100%", position: "relative", zIndex: 1 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(34,197,94,0.1)", border: "2px solid var(--grn)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 0 40px var(--grn-g)" }}>
              <span style={{ fontSize: 32 }}>✓</span>
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 32, letterSpacing: 4, color: "var(--grn)", marginBottom: 4 }}>CORRECT</div>
            <div style={{ fontSize: 14, color: "var(--txt-m)", marginBottom: 4 }}>The answer was</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 40, letterSpacing: 3, marginBottom: 24 }}>{round.answer.toUpperCase()}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              {PLAYERS_DATA.map((p, i) => (
                <div key={p.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", background: "var(--s1)", borderRadius: 10,
                  border: `1px solid ${p.id === stealer.id ? "var(--grn)" : "var(--bdr)"}`,
                  animation: `fadeUp 0.3s ease-out ${i * 0.08}s both`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Avatar player={p} size={28} />
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                  </div>
                  <span style={{ fontFamily: "var(--fm)", fontSize: 14, fontWeight: 600, color: p.id === stealer.id ? "var(--grn)" : "var(--red)" }}>
                    {p.id === stealer.id ? "+8" : "−1"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {phase === "result" && (
        <div style={{ padding: "12px 24px 28px" }}>
          <Btn primary onClick={onNext}>Next Round</Btn>
        </div>
      )}
    </Phone>
  );
}

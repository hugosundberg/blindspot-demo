import { useState, useEffect, useRef } from "react";
import { Phone, Avatar, Btn } from "../ui";
import { PLAYERS_DATA } from "../../data/constants";

/* ─────────────────────────────────────────────
   StealSequence
   isPlayerSteal=true  → player types answer, real result
   isPlayerSteal=false → simulated Kai steal (always correct)
───────────────────────────────────────────── */
export default function StealSequence({ round, stealer, isPlayerSteal = false, onNext }) {
  const [phase, setPhase]         = useState("flash");
  const [stealAnswer, setStealAnswer] = useState("");
  const [stealTimer, setStealTimer]   = useState(15);
  const [submitted, setSubmitted]     = useState(false);
  const [stealCorrect, setStealCorrect] = useState(null); // true | false
  const timerRef = useRef(null);

  /* ── Phase progression ── */
  useEffect(() => {
    if (isPlayerSteal) {
      const t1 = setTimeout(() => setPhase("input"), 900);
      return () => clearTimeout(t1);
    } else {
      const t1 = setTimeout(() => setPhase("countdown"), 900);
      const t2 = setTimeout(() => setPhase("typing"),    2800);
      const t3 = setTimeout(() => setPhase("result"),    4500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [isPlayerSteal]);

  /* ── Player steal: countdown timer ── */
  useEffect(() => {
    if (phase !== "input" || !isPlayerSteal) return;
    timerRef.current = setInterval(() => {
      setStealTimer(t => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, isPlayerSteal]);

  /* ── Player steal: auto-fail when timer hits 0 ── */
  useEffect(() => {
    if (stealTimer === 0 && phase === "input" && !submitted) {
      resolveSteal(false);
    }
  }, [stealTimer, phase, submitted]); // eslint-disable-line

  const resolveSteal = (correct) => {
    clearInterval(timerRef.current);
    setSubmitted(true);
    setStealCorrect(correct);
    setTimeout(() => setPhase("result"), 800);
  };

  const handleSubmit = () => {
    if (!stealAnswer.trim() || submitted) return;
    const correct = stealAnswer.trim().toLowerCase() === round.answer.toLowerCase();
    resolveSteal(correct);
  };

  /* ─────────── RENDER ─────────── */
  return (
    <Phone flash={phase === "flash" ? "var(--red)" : null}>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: 24, position: "relative",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(circle at 50% 40%, var(--red-gs) 0%, transparent 60%)",
          opacity: phase === "flash" || phase === "countdown" ? .7 : .3,
          transition: "opacity 0.5s",
        }} />

        {/* ── flash ── */}
        {phase === "flash" && (
          <div style={{ animation: "scaleIn 0.4s ease-out", textAlign: "center", position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "var(--fd)", fontSize: 56, color: "var(--red)", letterSpacing: 8, textShadow: "0 0 40px var(--red-gs)" }}>⚡ STEAL</div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 12, color: "var(--txt-m)", marginTop: 8, letterSpacing: 2 }}>
              {isPlayerSteal ? "YOU ARE ATTEMPTING A STEAL" : `${stealer.name.toUpperCase()} IS ATTEMPTING A STEAL`}
            </div>
          </div>
        )}

        {/* ── player input phase ── */}
        {phase === "input" && isPlayerSteal && (
          <div style={{ textAlign: "center", animation: "scaleIn 0.3s ease-out", position: "relative", zIndex: 1, width: "100%" }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              border: `3px solid ${stealTimer <= 5 ? "var(--red)" : "var(--amb)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              animation: stealTimer <= 5 ? "pulseRed 0.6s ease-in-out infinite" : "none",
              transition: "border-color 0.3s",
            }}>
              <span style={{ fontFamily: "var(--fd)", fontSize: 48, color: stealTimer <= 5 ? "var(--red)" : "var(--amb)" }}>
                {stealTimer}
              </span>
            </div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 24 }}>
              SECONDS TO ANSWER
            </div>

            <div style={{ margin: "0 0 16px" }}>
              <div style={{
                background: "var(--s1)", borderRadius: 14,
                border: `1.5px solid ${submitted ? "var(--grn)" : "var(--bdr)"}`,
                padding: "4px", transition: "border-color 0.3s",
              }}>
                <input
                  autoFocus
                  type="text"
                  value={stealAnswer}
                  onChange={e => setStealAnswer(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  placeholder="Your answer..."
                  style={{
                    width: "100%", background: "transparent", border: "none",
                    padding: "14px 16px", fontSize: 18, fontWeight: 500,
                    color: "var(--txt)", outline: "none", letterSpacing: .5,
                  }}
                />
              </div>
            </div>

            <Btn
              primary
              disabled={!stealAnswer.trim() || submitted}
              onClick={handleSubmit}
              style={{ background: submitted ? "var(--grn)" : "var(--red)", boxShadow: submitted ? "0 4px 20px var(--grn-g)" : "0 4px 20px var(--red-g)" }}
            >
              {submitted ? "✓ Locked In" : "⚡ Submit Steal"}
            </Btn>

            <div style={{ marginTop: 12, display: "flex", gap: 12, justifyContent: "center" }}>
              {PLAYERS_DATA.filter(p => p.id !== stealer.id).map(p => (
                <div key={p.id} style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--s1)", border: "1.5px solid var(--bdr)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--fd)", fontSize: 14, color: "var(--txt-d)",
                  animation: "stealFlash 0.8s ease-in-out infinite",
                }}>{p.av}</div>
              ))}
            </div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--txt-d)", marginTop: 8 }}>ALL TRADES FROZEN</div>
          </div>
        )}

        {/* ── AI countdown (Kai stealing) ── */}
        {phase === "countdown" && !isPlayerSteal && (
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

        {/* ── AI typing ── */}
        {phase === "typing" && !isPlayerSteal && (
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

        {/* ── result ── */}
        {phase === "result" && (() => {
          const correct = isPlayerSteal ? stealCorrect : true; // AI steal always succeeds
          return (
            <div style={{ textAlign: "center", animation: "scaleIn 0.4s ease-out", width: "100%", position: "relative", zIndex: 1 }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: correct ? "rgba(34,197,94,0.1)" : "rgba(220,38,38,0.1)",
                border: `2px solid ${correct ? "var(--grn)" : "var(--red)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
                boxShadow: `0 0 40px ${correct ? "var(--grn-g)" : "var(--red-g)"}`,
              }}>
                <span style={{ fontSize: 32 }}>{correct ? "✓" : "✗"}</span>
              </div>
              <div style={{ fontFamily: "var(--fd)", fontSize: 32, letterSpacing: 4, color: correct ? "var(--grn)" : "var(--red)", marginBottom: 4 }}>
                {correct ? "CORRECT" : "WRONG"}
              </div>
              <div style={{ fontSize: 14, color: "var(--txt-m)", marginBottom: 4 }}>The answer was</div>
              <div style={{ fontFamily: "var(--fd)", fontSize: 40, letterSpacing: 3, marginBottom: 8 }}>{round.answer.toUpperCase()}</div>
              {isPlayerSteal && (
                <div style={{ fontFamily: "var(--fm)", fontSize: 13, color: "var(--txt-d)", marginBottom: 16 }}>
                  {correct ? "You get +8 chips. Every other player loses 1." : "You lose 5 chips. The round continues for others."}
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                {PLAYERS_DATA.map((p, i) => {
                  const isTheStealer = p.id === stealer.id;
                  const delta = isTheStealer
                    ? (correct ? "+8" : "−5")
                    : (correct ? "−1" : "—");
                  const deltaColor = isTheStealer
                    ? (correct ? "var(--grn)" : "var(--red)")
                    : (correct ? "var(--red)" : "var(--txt-d)");
                  return (
                    <div key={p.id} style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      padding: "10px 14px", background: "var(--s1)", borderRadius: 10,
                      border: `1px solid ${isTheStealer ? (correct ? "var(--grn)" : "var(--red)") : "var(--bdr)"}`,
                      animation: `fadeUp 0.3s ease-out ${i * 0.08}s both`,
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar player={p} size={28} />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                        {isTheStealer && <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--txt-d)", letterSpacing: 1 }}>STEALER</span>}
                      </div>
                      <span style={{ fontFamily: "var(--fm)", fontSize: 14, fontWeight: 600, color: deltaColor }}>{delta}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {phase === "result" && (
        <div style={{ padding: "12px 24px 28px" }}>
          <Btn primary onClick={() => onNext(isPlayerSteal ? stealCorrect : true)}>Next Round</Btn>
        </div>
      )}
    </Phone>
  );
}

import { useState, useEffect } from "react";
import { Phone, ScreenTransition, Hdr, Avatar, Btn } from "../ui";
import { PLAYERS_DATA } from "../../data/constants";

/* ─────────────────────────────────────────────
   PoisonReveal
   correct: true  → player answered correctly (show correct → poison reveal)
   correct: false → player answered wrong     (show wrong   → poison reveal)
   correct: null  → player passed             (show passed  → poison reveal)
───────────────────────────────────────────── */
export default function PoisonReveal({ round, chips, correct, onNext }) {
  const [phase, setPhase] = useState("result");
  useEffect(() => { setTimeout(() => setPhase("poison"), 2200); }, []);

  /* ── Initial result screen ── */
  if (phase === "result") {
    const isCorrect = correct === true;
    const isPassed  = correct === null;

    return (
      <Phone>
        <ScreenTransition type="scale">
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24 }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: isCorrect ? "rgba(34,197,94,0.1)" : isPassed ? "rgba(107,107,118,0.1)" : "rgba(220,38,38,0.1)",
              border: `2px solid ${isCorrect ? "var(--grn)" : isPassed ? "var(--txt-d)" : "var(--red)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              animation: isCorrect ? "scaleIn 0.4s ease-out" : "shakeX 0.5s ease-out",
              boxShadow: isCorrect ? "0 0 30px var(--grn-g)" : isPassed ? "none" : "0 0 20px var(--red-g)",
            }}>
              <span style={{ fontSize: 32 }}>{isCorrect ? "✓" : isPassed ? "—" : "✗"}</span>
            </div>

            <div style={{
              fontFamily: "var(--fd)", fontSize: 36, letterSpacing: 4,
              color: isCorrect ? "var(--grn)" : isPassed ? "var(--txt-m)" : "var(--red)",
              marginBottom: 4,
            }}>
              {isCorrect ? "CORRECT" : isPassed ? "PASSED" : "WRONG"}
            </div>

            {!isPassed && (
              <>
                <div style={{ fontSize: 14, color: "var(--txt-m)", marginBottom: 4 }}>The answer was</div>
                <div style={{ fontFamily: "var(--fd)", fontSize: 42, letterSpacing: 3 }}>{round.answer.toUpperCase()}</div>
              </>
            )}

            <div style={{
              fontFamily: "var(--fm)", fontSize: 18, fontWeight: 600, marginTop: 8,
              color: isCorrect ? "var(--grn)" : isPassed ? "var(--txt-d)" : "var(--red)",
            }}>
              {isCorrect ? "+5 chips" : isPassed ? "No change" : "−2 chips"}
            </div>

            <div style={{ marginTop: 16, fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, animation: "pulse 1s ease-in-out infinite" }}>
              INVESTIGATING FRAGMENTS...
            </div>
          </div>
        </ScreenTransition>
      </Phone>
    );
  }

  /* ── Poison reveal screen ── */
  return (
    <Phone flash="rgba(245,158,11,0.2)">
      <ScreenTransition type="scale">
        <Hdr round={round.num} total={15} phase="REVEAL" chips={chips} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(245,158,11,0.08)", border: "2px solid var(--amb)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
              animation: "pulseRed 1.5s ease-in-out infinite",
              boxShadow: "0 0 30px var(--amb-g)",
            }}>
              <span style={{ fontSize: 32 }}>☠</span>
            </div>

            <div style={{ fontFamily: "var(--fd)", fontSize: 32, letterSpacing: 4, color: "var(--amb)", marginBottom: 8 }}>
              POISON FRAGMENT
            </div>
            <div style={{ fontSize: 14, color: "var(--txt-m)", marginBottom: 20, fontWeight: 300 }}>
              {round.poisonHolder}'s fragment was a decoy planted by the app
            </div>

            <div style={{ background: "var(--s1)", border: "1.5px solid rgba(245,158,11,0.3)", borderRadius: 14, padding: 20, textAlign: "left", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--amb)", letterSpacing: 2, marginBottom: 10 }}>DECOY FRAGMENT</div>
              <div style={{ fontSize: 16, color: "var(--txt-m)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.5 }}>
                "{round.poisonFragment}"
              </div>
            </div>

            <div style={{ background: "var(--s1)", borderRadius: 14, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--bdr)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar player={PLAYERS_DATA[2]} size={30} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Kai sold it to Zoe</span>
              </div>
              <span style={{ fontFamily: "var(--fm)", fontSize: 13, color: "var(--amb)" }}>3 chips</span>
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 24px 28px" }}>
          <Btn primary onClick={onNext}>Continue</Btn>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

import { Phone, Btn } from "../ui";

const COLORS = ["#DC2626","#8B5CF6","#0EA5E9","#F59E0B","#10B981","#EC4899","#F97316","#6366F1"];

export default function Splash({ playerName, playerColor, onNameChange, onColorChange, onNext, onJoin }) {
  const ready = playerName?.trim().length > 0;

  return (
    <Phone>
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center", padding: 32, position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 35%, var(--red-g) 0%, transparent 60%)", opacity: .5 }} />

        <div style={{ animation: "scaleIn 0.6s ease-out", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: 72, letterSpacing: 8, color: "var(--txt)", lineHeight: 1, textShadow: "0 0 60px var(--red-gs)" }}>
            BLIND<span style={{ color: "var(--red)" }}>SPOT</span>
          </div>
          <div style={{ width: 120, height: 3, background: "var(--red)", borderRadius: 2, margin: "10px auto 0", animation: "fadeIn 0.8s ease-out 0.4s both" }} />
          <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 3, marginTop: 14 }}>
            THE PARTY QUIZ WHERE NOBODY KNOWS ENOUGH
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, marginTop: 48, width: "100%", animation: "fadeUp 0.5s ease-out 0.3s both", display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Name input */}
          <div style={{ background: "var(--s1)", borderRadius: 14, border: "1.5px solid var(--bdr)", padding: "4px" }}>
            <input
              autoFocus
              type="text"
              maxLength={16}
              value={playerName}
              onChange={e => onNameChange(e.target.value)}
              placeholder="Your name..."
              style={{
                width: "100%", background: "transparent", border: "none",
                padding: "12px 16px", fontSize: 16, fontWeight: 500,
                color: "var(--txt)", outline: "none", letterSpacing: .5,
              }}
            />
          </div>

          {/* Colour picker */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {COLORS.map(c => (
              <div
                key={c}
                onClick={() => onColorChange(c)}
                style={{
                  width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer",
                  border: playerColor === c ? "2.5px solid white" : "2.5px solid transparent",
                  boxShadow: playerColor === c ? `0 0 10px ${c}` : "none",
                  transition: "all 0.15s",
                }}
              />
            ))}
          </div>

          <Btn primary disabled={!ready} onClick={onNext}>Create Game</Btn>
          <div style={{ textAlign: "center" }}>
            <span
              onClick={ready ? onJoin : undefined}
              style={{
                fontSize: 14, color: ready ? "var(--txt-m)" : "var(--txt-d)",
                cursor: ready ? "pointer" : "default",
                textDecoration: ready ? "underline" : "none",
                textDecorationColor: "var(--bdr)",
              }}
            >
              Join with code
            </span>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 32, fontFamily: "var(--fm)", fontSize: 10, color: "var(--txt-d)", letterSpacing: 2 }}>
          3–8 PLAYERS • 30–60 MIN
        </div>
      </div>
    </Phone>
  );
}

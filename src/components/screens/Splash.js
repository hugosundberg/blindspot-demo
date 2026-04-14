import { Phone, Btn } from "../ui";

export default function Splash({ onNext, onJoin }) {
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

        <div style={{ position: "relative", zIndex: 1, marginTop: 60, width: "100%", animation: "fadeUp 0.5s ease-out 0.3s both" }}>
          <Btn primary onClick={onNext}>Create Game</Btn>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <span
              onClick={onJoin}
              style={{ fontSize: 14, color: "var(--txt-m)", cursor: "pointer", textDecoration: "underline", textDecorationColor: "var(--bdr)" }}
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

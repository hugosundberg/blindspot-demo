import { Phone, ScreenTransition, Avatar, Btn } from "../ui";
import { PLAYERS_DATA } from "../../data/constants";

export default function RoundResult({ round, correct, chips, chipDelta, onNext }) {
  return (
    <Phone flash={correct ? "rgba(34,197,94,0.3)" : correct === false ? "rgba(220,38,38,0.3)" : null}>
      <ScreenTransition type="scale">
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, ${correct ? "var(--grn-g)" : "var(--red-g)"} 0%, transparent 60%)`, opacity: .5 }} />

          <div style={{ position: "relative", zIndex: 1, textAlign: "center", width: "100%" }}>
            {correct === null ? (
              <>
                <div style={{ fontFamily: "var(--fd)", fontSize: 36, letterSpacing: 4, color: "var(--txt-m)", marginBottom: 8 }}>PASSED</div>
                <div style={{ fontSize: 14, color: "var(--txt-d)" }}>No risk, no reward</div>
              </>
            ) : (
              <>
                <div style={{
                  width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px",
                  background: correct ? "rgba(34,197,94,0.1)" : "rgba(220,38,38,0.1)",
                  border: `2px solid ${correct ? "var(--grn)" : "var(--red)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32,
                  boxShadow: `0 0 30px ${correct ? "var(--grn-g)" : "var(--red-g)"}`,
                  animation: "scaleIn 0.4s ease-out",
                }}>{correct ? "✓" : "✗"}</div>

                <div style={{ fontFamily: "var(--fd)", fontSize: 36, letterSpacing: 4, color: correct ? "var(--grn)" : "var(--red)", marginBottom: 4 }}>
                  {correct ? "CORRECT" : "WRONG"}
                </div>
                <div style={{ fontSize: 14, color: "var(--txt-m)", marginBottom: 4 }}>The answer was</div>
                <div style={{ fontFamily: "var(--fd)", fontSize: 42, letterSpacing: 3, marginBottom: 8 }}>{round.answer.toUpperCase()}</div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 18, fontWeight: 600, color: chipDelta > 0 ? "var(--grn)" : "var(--red)", animation: "scaleIn 0.3s ease-out 0.3s both" }}>
                  {chipDelta > 0 ? "+" : ""}{chipDelta} chips
                </div>
              </>
            )}

            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
              {PLAYERS_DATA.slice(1).map((p, i) => {
                const pCorrect = i < 2;
                return (
                  <div key={p.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 14px", background: "var(--s1)", borderRadius: 10, border: "1px solid var(--bdr)",
                    animation: `fadeUp 0.3s ease-out ${0.4 + i * 0.08}s both`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Avatar player={p} size={28} />
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                    </div>
                    <span style={{ fontFamily: "var(--fm)", fontSize: 13, fontWeight: 600, color: pCorrect ? "var(--grn)" : "var(--red)" }}>
                      {pCorrect ? "+5" : "−2"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 24px 28px" }}>
          <Btn primary onClick={onNext}>Next Round</Btn>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

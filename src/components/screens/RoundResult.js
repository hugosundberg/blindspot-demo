import { useState, useEffect } from "react";
import { Phone, ScreenTransition, Avatar, Btn } from "../ui";

export default function RoundResult({ round, result, mySocketId, chips }) {
  const [phase, setPhase] = useState("result");

  // Auto-advance to poison reveal for poison rounds
  useEffect(() => {
    if (result?.questionType === "poison" && result?.poisonReveal) {
      setTimeout(() => setPhase("poison"), 2200);
    }
  }, [result]);

  if (!result) return null;

  const myDelta  = result.chipDeltas?.find(d => d.socketId === mySocketId);
  const correct  = myDelta?.correct ?? null;
  const chipDelta = correct === true ? 5 : correct === false ? -2 : 0;

  /* ── Normal result view ── */
  if (phase === "result") {
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
                  <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px", background: correct ? "rgba(34,197,94,0.1)" : "rgba(220,38,38,0.1)", border: `2px solid ${correct ? "var(--grn)" : "var(--red)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, boxShadow: `0 0 30px ${correct ? "var(--grn-g)" : "var(--red-g)"}`, animation: "scaleIn 0.4s ease-out" }}>
                    {correct ? "✓" : "✗"}
                  </div>
                  <div style={{ fontFamily: "var(--fd)", fontSize: 36, letterSpacing: 4, color: correct ? "var(--grn)" : "var(--red)", marginBottom: 4 }}>{correct ? "CORRECT" : "WRONG"}</div>
                  <div style={{ fontSize: 14, color: "var(--txt-m)", marginBottom: 4 }}>The answer was</div>
                  <div style={{ fontFamily: "var(--fd)", fontSize: 42, letterSpacing: 3, marginBottom: 8 }}>{result.questionAnswer?.toUpperCase()}</div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 18, fontWeight: 600, color: chipDelta > 0 ? "var(--grn)" : chipDelta < 0 ? "var(--red)" : "var(--txt-d)", animation: "scaleIn 0.3s ease-out 0.3s both" }}>
                    {chipDelta > 0 ? "+" : ""}{chipDelta} chips
                  </div>
                </>
              )}

              {/* All players chip deltas */}
              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 6, width: "100%" }}>
                {result.players?.map((p, i) => {
                  const d = result.chipDeltas?.find(x => x.socketId === p.socketId);
                  const delta = d?.correct === true ? "+5" : d?.correct === false ? "−2" : "—";
                  const dColor = d?.correct === true ? "var(--grn)" : d?.correct === false ? "var(--red)" : "var(--txt-d)";
                  return (
                    <div key={p.socketId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--s1)", borderRadius: 10, border: "1px solid var(--bdr)", animation: `fadeUp 0.3s ease-out ${0.4 + i * 0.08}s both` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <Avatar player={p} size={28} />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</span>
                      </div>
                      <span style={{ fontFamily: "var(--fm)", fontSize: 13, fontWeight: 600, color: dColor }}>{delta}</span>
                    </div>
                  );
                })}
              </div>

              {result.questionType === "poison" && result.poisonReveal && (
                <div style={{ marginTop: 12, fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, animation: "pulse 1s ease-in-out infinite" }}>
                  INVESTIGATING FRAGMENTS...
                </div>
              )}
            </div>
          </div>

          {result.questionType !== "poison" && (
            <div style={{ padding: "12px 24px 28px" }}>
              <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, textAlign: "center" }}>
                NEXT ROUND LOADING...
              </div>
            </div>
          )}
        </ScreenTransition>
      </Phone>
    );
  }

  /* ── Poison reveal view ── */
  const { poisonReveal } = result;
  const poisonHolder = result.players?.find(p => p.socketId === poisonReveal.poisonHolderSocketId);
  const soldEntry = poisonReveal.soldTo?.[0];
  const buyer     = soldEntry ? result.players?.find(p => p.socketId === soldEntry.buyerSocketId) : null;

  return (
    <Phone flash="rgba(245,158,11,0.2)">
      <ScreenTransition type="scale">
        <div style={{ padding: "16px 24px 8px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: 20, letterSpacing: 2 }}>ROUND {round?.roundNum}</div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(245,158,11,0.08)", border: "2px solid var(--amb)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "pulseRed 1.5s ease-in-out infinite", boxShadow: "0 0 30px var(--amb-g)" }}>
              <span style={{ fontSize: 32 }}>☠</span>
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 32, letterSpacing: 4, color: "var(--amb)", marginBottom: 8 }}>POISON FRAGMENT</div>
            <div style={{ fontSize: 14, color: "var(--txt-m)", marginBottom: 20, fontWeight: 300 }}>
              {poisonHolder?.name || "A player"}'s fragment was a decoy planted by the app
            </div>

            <div style={{ background: "var(--s1)", border: "1.5px solid rgba(245,158,11,0.3)", borderRadius: 14, padding: 20, textAlign: "left", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--amb)", letterSpacing: 2, marginBottom: 10 }}>DECOY FRAGMENT</div>
              <div style={{ fontSize: 16, color: "var(--txt-m)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.5 }}>
                "{poisonReveal.poisonFragment}"
              </div>
            </div>

            {buyer && soldEntry && (
              <div style={{ background: "var(--s1)", borderRadius: 14, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--bdr)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar player={poisonHolder} size={30} />
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{poisonHolder?.name} sold it to {buyer.name}</span>
                </div>
                <span style={{ fontFamily: "var(--fm)", fontSize: 13, color: "var(--amb)" }}>{soldEntry.chipAmount} chips</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "12px 24px 28px" }}>
          <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, textAlign: "center" }}>
            NEXT ROUND LOADING...
          </div>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

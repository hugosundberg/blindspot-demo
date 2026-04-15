import { Phone, ScreenTransition, Btn } from "../ui";

export default function Leaderboard({ leaderboard, mySocketId, onRestart }) {
  if (!leaderboard) return null;

  const players  = leaderboard.players || [];
  const standings = [...players].sort((a, b) => b.chips - a.chips);

  return (
    <Phone>
      <ScreenTransition type="scale">
        <div style={{ padding: "12px 24px 8px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: 36, letterSpacing: 4, lineHeight: 1 }}>GAME OVER</div>
          <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, marginTop: 4 }}>
            FINAL STANDINGS
          </div>
        </div>

        <div style={{ flex: 1, padding: "12px 20px", overflow: "auto", minHeight: 0 }}>
          {standings.map((p, i) => {
            const isMe = p.socketId === mySocketId;
            return (
              <div key={p.socketId} style={{
                background: i === 0 ? `${p.color}08` : "var(--s1)",
                border: `1.5px solid ${i === 0 ? p.color : isMe ? "rgba(255,255,255,0.15)" : "var(--bdr)"}`,
                borderRadius: 16, padding: 16, marginBottom: 10, position: "relative", overflow: "hidden",
                animation: `fadeUp 0.4s ease-out ${i * 0.1}s both`,
              }}>
                {i === 0 && (
                  <div style={{ position: "absolute", top: 0, right: 0, background: p.color, color: "white", fontFamily: "var(--fd)", fontSize: 12, letterSpacing: 2, padding: "4px 12px", borderRadius: "0 0 0 8px" }}>
                    WINNER
                  </div>
                )}
                {isMe && i !== 0 && (
                  <div style={{ position: "absolute", top: 0, right: 0, background: "rgba(255,255,255,0.08)", color: "var(--txt-d)", fontFamily: "var(--fd)", fontSize: 11, letterSpacing: 2, padding: "4px 12px", borderRadius: "0 0 0 8px" }}>
                    YOU
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                  <div style={{ fontFamily: "var(--fd)", fontSize: 32, color: "var(--txt-d)", width: 28, textAlign: "center", lineHeight: 1 }}>{i + 1}</div>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${p.color}20`, border: `2px solid ${p.color}60`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontSize: 20, color: p.color }}>
                    {p.avatarChar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)" }} />
                      <span style={{ fontFamily: "var(--fm)", fontSize: 14, fontWeight: 600 }}>{p.chips} chips</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                  {[
                    { l: "Correct", v: p.stats?.correct ?? 0 },
                    { l: "Steals",  v: p.stats?.steals  ?? 0 },
                    { l: "Bluff",   v: `${p.stats?.poisonSold ?? 0}` },
                  ].map(s => (
                    <div key={s.l} style={{ background: "var(--s2)", borderRadius: 8, padding: 8, textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--fm)", fontSize: 15, fontWeight: 600 }}>{s.v}</div>
                      <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--txt-d)", letterSpacing: 1, marginTop: 2 }}>{s.l.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "8px 20px 28px", display: "flex", gap: 10 }}>
          <Btn primary onClick={onRestart} style={{ flex: 1 }}>Play Again</Btn>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

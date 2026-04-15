import { Phone, ScreenTransition, Btn } from "../ui";

/* AI player results are simulated but vary per game to feel dynamic */
function generateAiStandings(playerChips, playerStats) {
  const baseChips = [17, 14, 11]; // Kai, Zoe, Mia starting points
  return [
    { name: "Kai", av: "K", color: "#0EA5E9", chips: baseChips[0] + Math.floor(Math.random() * 8), correct: 5 + Math.floor(Math.random() * 3), steals: 1 + Math.floor(Math.random() * 2), bluff: 72 + Math.floor(Math.random() * 20) },
    { name: "Zoe", av: "Z", color: "#F59E0B", chips: baseChips[1] + Math.floor(Math.random() * 6), correct: 3 + Math.floor(Math.random() * 3), steals: Math.floor(Math.random() * 2),               bluff: 80 + Math.floor(Math.random() * 15) },
    { name: "Mia", av: "M", color: "#8B5CF6", chips: baseChips[2] + Math.floor(Math.random() * 5), correct: 3 + Math.floor(Math.random() * 2), steals: Math.floor(Math.random() * 2),               bluff: 20 + Math.floor(Math.random() * 20) },
  ];
}

export default function Leaderboard({ chips = 10, stats = { correct: 0, steals: 0 }, onRestart }) {
  // Generate AI standings once; useMemo would be ideal but static ref is fine for a demo
  const aiPlayers = generateAiStandings(chips, stats);

  const you = {
    name: "You", av: "Y", color: "#DC2626",
    chips,
    correct: stats.correct,
    steals: stats.steals,
    bluff: Math.min(99, Math.round((stats.steals / Math.max(1, stats.correct + stats.steals)) * 100 + Math.random() * 30)),
  };

  // Sort all players by chip count descending
  const standings = [you, ...aiPlayers].sort((a, b) => b.chips - a.chips);

  return (
    <Phone>
      <ScreenTransition type="scale">
        <div style={{ padding: "12px 24px 8px", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: 36, letterSpacing: 4, lineHeight: 1 }}>GAME OVER</div>
          <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, marginTop: 4 }}>3 ROUNDS COMPLETED</div>
        </div>

        <div style={{ flex: 1, padding: "12px 20px", overflow: "auto", minHeight: 0 }}>
          {standings.map((p, i) => (
            <div key={p.name} style={{
              background: i === 0 ? `${p.color}08` : "var(--s1)",
              border: `1.5px solid ${i === 0 ? p.color : "var(--bdr)"}`,
              borderRadius: 16, padding: 16, marginBottom: 10, position: "relative", overflow: "hidden",
              animation: `fadeUp 0.4s ease-out ${i * 0.1}s both`,
            }}>
              {i === 0 && (
                <div style={{ position: "absolute", top: 0, right: 0, background: p.color, color: "white", fontFamily: "var(--fd)", fontSize: 12, letterSpacing: 2, padding: "4px 12px", borderRadius: "0 0 0 8px" }}>
                  WINNER
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                <div style={{ fontFamily: "var(--fd)", fontSize: 32, color: "var(--txt-d)", width: 28, textAlign: "center", lineHeight: 1 }}>{i + 1}</div>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `${p.color}20`, border: `2px solid ${p.color}60`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fd)", fontSize: 20, color: p.color }}>{p.av}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red)" }} />
                    <span style={{ fontFamily: "var(--fm)", fontSize: 14, fontWeight: 600 }}>{p.chips} chips</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {[{ l: "Correct", v: p.correct }, { l: "Steals", v: p.steals }, { l: "Bluff", v: `${p.bluff}%` }].map(s => (
                  <div key={s.l} style={{ background: "var(--s2)", borderRadius: 8, padding: 8, textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--fm)", fontSize: 15, fontWeight: 600 }}>{s.v}</div>
                    <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--txt-d)", letterSpacing: 1, marginTop: 2 }}>{s.l.toUpperCase()}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "8px 20px 28px", display: "flex", gap: 10 }}>
          <Btn style={{ flex: 1 }}>Share</Btn>
          <Btn primary onClick={onRestart} style={{ flex: 2 }}>Play Again</Btn>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

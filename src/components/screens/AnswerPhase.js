import { useState, useEffect } from "react";
import { Phone, ScreenTransition, Hdr, TimerBar, Avatar, Btn } from "../ui";

export default function AnswerPhase({ round, chips, collectedFragments = [], answeredPlayers = [], players = [], onSubmit, onPass, hasStolen = false }) {
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(100);

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 1.5)), 200);
    return () => clearInterval(iv);
  }, []);

  const handleSubmit = () => {
    if (!answer.trim() || submitted) return;
    setSubmitted(true);
    if (onSubmit) onSubmit(answer.trim());
  };

  const handlePass = () => {
    if (submitted) return;
    setSubmitted(true);
    if (onPass) onPass();
  };

  if (!round) return null;

  return (
    <Phone>
      <ScreenTransition type="fade">
        <Hdr round={round.roundNum} total={round.totalRounds} phase="ANSWER" chips={chips} />
        <TimerBar pct={timer} color={timer < 30 ? "var(--amb)" : "var(--red)"} />

        <div style={{ flex: 1, padding: "20px 24px", display: "flex", flexDirection: "column" }}>
          <div style={{ textAlign: "center", marginBottom: 24, animation: "fadeIn 0.3s" }}>
            <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: hasStolen ? "var(--red)" : "var(--txt-d)", letterSpacing: 2, marginBottom: 6 }}>{hasStolen ? "STEAL ATTEMPTED" : "TRADE WINDOW CLOSED"}</div>
            <div style={{ fontSize: 14, color: "var(--txt-m)", fontWeight: 300 }}>{hasStolen ? "You cannot submit an answer" : "Submit your answer or pass"}</div>
          </div>

          {/* Fragments collected */}
          <div style={{ background: "var(--s1)", borderRadius: 14, border: "1px solid var(--bdr)", padding: 16, marginBottom: 16, animation: "fadeUp 0.3s ease-out 0.1s both" }}>
            <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 10 }}>FRAGMENTS COLLECTED</div>
            {collectedFragments.length > 0 ? (
              collectedFragments.map((f, i) => (
                <div key={i} style={{ padding: "7px 12px", background: "var(--s2)", borderRadius: 8, fontSize: 13, color: "var(--txt-m)", fontWeight: 300, borderLeft: `2px solid ${f.isPoison ? "var(--amb)" : f.isOwn ? "var(--red)" : "#0EA5E9"}`, marginBottom: 6 }}>
                  "{f.fragment}"
                </div>
              ))
            ) : (
              <div style={{ fontSize: 13, color: "var(--txt-d)", fontStyle: "italic" }}>No fragments collected yet</div>
            )}
          </div>

          {/* Who has answered */}
          {players.length > 0 && (
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 16 }}>
              {players.map(p => (
                <div key={p.socketId} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <Avatar player={p} size={30} muted={!answeredPlayers.includes(p.socketId)} />
                  <span style={{ fontSize: 9, fontFamily: "var(--fm)", color: answeredPlayers.includes(p.socketId) ? "var(--grn)" : "var(--txt-d)" }}>
                    {answeredPlayers.includes(p.socketId) ? "✓" : "..."}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Answer input */}
          {!hasStolen && (
            <div style={{ animation: "fadeUp 0.3s ease-out 0.2s both" }}>
              <div style={{ background: "var(--s1)", borderRadius: 14, border: `1.5px solid ${submitted ? "var(--grn)" : "var(--bdr)"}`, padding: "4px", transition: "border-color 0.3s" }}>
                <input
                  type="text" value={answer} onChange={e => setAnswer(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSubmit()}
                  disabled={submitted}
                  placeholder="Type your answer..."
                  style={{ width: "100%", background: "transparent", border: "none", padding: "14px 16px", fontSize: 18, fontWeight: 500, color: "var(--txt)", outline: "none", letterSpacing: .5 }}
                />
              </div>
            </div>
          )}

          <div style={{ flex: 1 }} />

          <div style={{ display: "flex", gap: 12, animation: "fadeUp 0.4s ease-out 0.3s both" }}>
            {hasStolen ? (
              <div style={{ flex: 1, textAlign: "center", padding: "14px", background: "rgba(220,38,38,0.08)", border: "1px solid var(--red)", borderRadius: 10 }}>
                <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--red)", letterSpacing: 2 }}>⚡ STEAL ATTEMPTED</div>
                <div style={{ fontSize: 12, color: "var(--txt-d)", marginTop: 4 }}>Waiting for others to answer...</div>
              </div>
            ) : (
              <>
                <Btn disabled={submitted} onClick={handlePass} style={{ flex: 1 }}>Pass</Btn>
                <Btn primary disabled={!answer.trim() || submitted} onClick={handleSubmit}
                  style={{ flex: 2, background: submitted ? "var(--grn)" : "var(--red)", boxShadow: submitted ? "0 4px 20px var(--grn-g)" : "0 4px 20px var(--red-g)" }}>
                  {submitted ? "✓ Locked In" : "Submit Answer"}
                </Btn>
              </>
            )}
          </div>
        </div>

        <div style={{ height: 16 }} />
      </ScreenTransition>
    </Phone>
  );
}

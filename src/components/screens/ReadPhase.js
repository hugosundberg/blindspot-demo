import { useState, useEffect } from "react";
import { Phone, ScreenTransition, Hdr, TimerBar, Pill, FragmentCard, Avatar, Btn } from "../ui";

export default function ReadPhase({ round, chips, players = [], onNext }) {
  const [revealed, setRevealed] = useState(false);
  const [timer, setTimer] = useState(100);

  useEffect(() => { setTimeout(() => setRevealed(true), 500); }, []);
  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 2)), 200);
    return () => clearInterval(iv);
  }, []);

  if (!round) return null;

  const isPoison = round.isPoison;
  // Other players are everyone except myself (identified by being already in players list)
  const otherPlayers = players.slice(0, 3); // show up to 3 others

  return (
    <Phone>
      <ScreenTransition type="fade">
        <Hdr round={round.roundNum} total={round.totalRounds} phase="READ" chips={chips} />
        <TimerBar pct={timer} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 28, animation: "fadeIn 0.3s ease-out" }}>
            <Pill>{round.category}</Pill>
          </div>

          <div style={{ opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s ease-out" }}>
            <FragmentCard
              text={round.fragment}
              verified={!isPoison}
              label={isPoison ? "⚠ Your Fragment" : "Your Fragment"}
              accent={isPoison ? "var(--amb)" : "var(--red)"}
            />
          </div>

          {isPoison && revealed && (
            <div style={{ textAlign: "center", marginTop: 16, animation: "fadeIn 0.5s ease-out 0.8s both" }}>
              <Pill color="var(--amb)" bg="rgba(245,158,11,0.1)">⚠ YOU HOLD A POISON FRAGMENT</Pill>
            </div>
          )}

          <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 16, animation: "fadeIn 0.6s ease-out 0.4s both" }}>
            {otherPlayers.map((p) => (
              <div key={p.socketId} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Avatar player={p} size={34} muted />
                <span style={{ fontSize: 10, color: "var(--txt-d)" }}>
                  {p.readyToTrade ? "Ready" : "Reading..."}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "12px 24px 28px" }}>
          <Btn primary onClick={onNext}>Continue to Trade</Btn>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

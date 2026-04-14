import { useState, useEffect } from "react";
import { Phone, ScreenTransition, Hdr, TimerBar, Pill, FragmentCard, Avatar, Btn } from "../ui";
import { PLAYERS_DATA } from "../../data/constants";

export default function ReadPhase({ round, chips, onNext }) {
  const [revealed, setRevealed] = useState(false);
  const [timer, setTimer] = useState(100);

  useEffect(() => { setTimeout(() => setRevealed(true), 500); }, []);
  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 2)), 200);
    return () => clearInterval(iv);
  }, []);

  return (
    <Phone>
      <ScreenTransition type="fade">
        <Hdr round={round.num} total={15} phase="READ" chips={chips} />
        <TimerBar pct={timer} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 28, animation: "fadeIn 0.3s ease-out" }}>
            <Pill>{round.category}</Pill>
          </div>

          <div style={{ opacity: revealed ? 1 : 0, transform: revealed ? "translateY(0)" : "translateY(16px)", transition: "all 0.6s ease-out" }}>
            <FragmentCard
              text={round.fragment}
              verified={!round.poison}
              label={round.poison ? "⚠ Your Fragment" : "Your Fragment"}
              accent={round.poison ? "var(--amb)" : "var(--red)"}
            />
          </div>

          {round.poison && revealed && (
            <div style={{ textAlign: "center", marginTop: 16, animation: "fadeIn 0.5s ease-out 0.8s both" }}>
              <Pill color="var(--amb)" bg="rgba(245,158,11,0.1)">⚠ YOU HOLD A POISON FRAGMENT</Pill>
            </div>
          )}

          <div style={{ marginTop: 28, display: "flex", justifyContent: "center", gap: 16, animation: "fadeIn 0.6s ease-out 0.4s both" }}>
            {PLAYERS_DATA.slice(1).map((p) => (
              <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Avatar player={p} size={34} muted />
                <span style={{ fontSize: 10, color: "var(--txt-d)" }}>Reading...</span>
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

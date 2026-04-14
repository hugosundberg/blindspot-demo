import { useState, useEffect } from "react";
import { Phone, ScreenTransition, Hdr, Avatar, Btn } from "../ui";
import { PLAYERS_DATA } from "../../data/constants";

export default function PoisonReveal({ round, chips, onNext }) {
  const [phase, setPhase] = useState("result");
  useEffect(() => { setTimeout(() => setPhase("poison"), 2000); }, []);

  if (phase === "result") {
    return (
      <Phone>
        <ScreenTransition type="scale">
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(220,38,38,0.1)", border: "2px solid var(--red)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "shakeX 0.5s ease-out" }}>
              <span style={{ fontSize: 32 }}>✗</span>
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 36, letterSpacing: 4, color: "var(--red)", marginBottom: 4 }}>WRONG</div>
            <div style={{ fontSize: 14, color: "var(--txt-m)", marginBottom: 4 }}>The answer was</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 42, letterSpacing: 3 }}>{round.answer.toUpperCase()}</div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 18, fontWeight: 600, color: "var(--red)", marginTop: 8 }}>−2 chips</div>
            <div style={{ marginTop: 16, fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, animation: "pulse 1s ease-in-out infinite" }}>
              INVESTIGATING FRAGMENTS...
            </div>
          </div>
        </ScreenTransition>
      </Phone>
    );
  }

  return (
    <Phone flash="rgba(245,158,11,0.2)">
      <ScreenTransition type="scale">
        <Hdr round={round.num} total={15} phase="REVEAL" chips={chips} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(245,158,11,0.08)", border: "2px solid var(--amb)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", animation: "pulseRed 1.5s ease-in-out infinite", boxShadow: "0 0 30px var(--amb-g)" }}>
              <span style={{ fontSize: 32 }}>☠</span>
            </div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 32, letterSpacing: 4, color: "var(--amb)", marginBottom: 8 }}>POISON FRAGMENT</div>
            <div style={{ fontSize: 14, color: "var(--txt-m)", marginBottom: 20, fontWeight: 300 }}>
              {round.poisonHolder}'s fragment was a decoy planted by the app
            </div>

            <div style={{ background: "var(--s1)", border: "1.5px solid rgba(245,158,11,0.3)", borderRadius: 14, padding: 20, textAlign: "left", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--amb)", letterSpacing: 2, marginBottom: 10 }}>DECOY FRAGMENT</div>
              <div style={{ fontSize: 16, color: "var(--txt-m)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.5 }}>"{round.poisonFragment}"</div>
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

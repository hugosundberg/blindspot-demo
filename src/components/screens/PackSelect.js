import { useState } from "react";
import { Phone, ScreenTransition, Btn } from "../ui";
import { PACKS } from "../../data/constants";

export default function PackSelect({ onNext }) {
  const [selected, setSelected] = useState(null);
  return (
    <Phone>
      <ScreenTransition type="up">
        <div style={{ padding: "16px 24px 8px" }}>
          <div style={{ fontFamily: "var(--fd)", fontSize: 28, letterSpacing: 2, lineHeight: 1 }}>CHOOSE YOUR PACK</div>
          <div style={{ fontSize: 13, color: "var(--txt-m)", marginTop: 4 }}>What do you want to be wrong about?</div>
        </div>

        <div style={{ flex: 1, padding: "12px 24px", display: "flex", flexDirection: "column", gap: 10, overflow: "auto", minHeight: 0 }}>
          {PACKS.map((pk, i) => (
            <div key={pk.name} onClick={() => setSelected(pk.name)} style={{
              display: "flex", alignItems: "center", gap: 16, padding: "18px 16px",
              background: selected === pk.name ? "var(--red)10" : "var(--s1)",
              border: `1.5px solid ${selected === pk.name ? "var(--red)" : "var(--bdr)"}`,
              borderRadius: 14, cursor: "pointer", transition: "all 0.2s",
              animation: `fadeUp 0.3s ease-out ${i * 0.06}s both`,
            }}>
              <span style={{ fontSize: 28 }}>{pk.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{pk.name}</div>
                <div style={{ fontSize: 12, color: "var(--txt-m)", marginTop: 2 }}>{pk.desc}</div>
              </div>
              {selected === pk.name && (
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white" }}>✓</div>
              )}
            </div>
          ))}

          <div style={{ marginTop: 8 }}>
            <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 8 }}>MATCH LENGTH</div>
            <div style={{ display: "flex", gap: 8 }}>
              {[{l:"Short",v:"10"},{l:"Standard",v:"15"},{l:"Marathon",v:"20"}].map((m) => (
                <div key={m.l} style={{
                  flex: 1, padding: "10px",
                  background: m.l === "Standard" ? "var(--red)12" : "var(--s1)",
                  border: `1.5px solid ${m.l === "Standard" ? "var(--red)" : "var(--bdr)"}`,
                  borderRadius: 10, textAlign: "center", cursor: "pointer",
                }}>
                  <div style={{ fontFamily: "var(--fd)", fontSize: 22, color: m.l === "Standard" ? "var(--red)" : "var(--txt)" }}>{m.v}</div>
                  <div style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--txt-d)", letterSpacing: 1 }}>{m.l.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 24px 28px" }}>
          <Btn primary disabled={!selected} onClick={onNext}>Start Game</Btn>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

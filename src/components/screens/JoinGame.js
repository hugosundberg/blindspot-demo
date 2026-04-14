import { useState } from "react";
import { Phone, ScreenTransition, Btn } from "../ui";

export default function JoinGame({ onJoin, onBack }) {
  const [code, setCode] = useState("");
  const [connecting, setConnecting] = useState(false);

  const handleJoin = () => {
    setConnecting(true);
    setTimeout(onJoin, 1500);
  };

  return (
    <Phone>
      <ScreenTransition type="up">
        <div style={{ padding: "20px 24px 12px", display: "flex", alignItems: "center", gap: 12 }}>
          <div
            onClick={onBack}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--s1)", border: "1px solid var(--bdr)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "var(--txt-m)" }}
          >
            ←
          </div>
          <div style={{ fontFamily: "var(--fd)", fontSize: 28, letterSpacing: 2, lineHeight: 1 }}>JOIN GAME</div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px" }}>
          <div style={{ animation: "fadeUp 0.4s ease-out" }}>
            <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 16, textAlign: "center" }}>
              ENTER ROOM CODE
            </div>

            {/* 4-box code input */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 32 }}>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} style={{
                  width: 64, height: 72, background: "var(--s1)",
                  border: `1.5px solid ${code.length > i ? "var(--red)" : "var(--bdr)"}`,
                  borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--fd)", fontSize: 36, color: "var(--txt)", letterSpacing: 2,
                  transition: "border-color 0.2s",
                }}>
                  {code[i] ? code[i].toUpperCase() : ""}
                </div>
              ))}
            </div>

            {/* Hidden real input driving the boxes */}
            <input
              autoFocus
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
              style={{
                position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1,
              }}
            />

            {/* Visible tap-to-type area */}
            <div
              onClick={() => document.querySelector("input[maxlength='4']")?.focus()}
              style={{
                background: "var(--s1)", border: "1.5px solid var(--bdr)", borderRadius: 12,
                padding: "14px 16px", textAlign: "center", cursor: "text", marginBottom: 24,
                fontSize: 14, color: "var(--txt-d)",
              }}
            >
              Tap to type code
            </div>

            {connecting ? (
              <div style={{ textAlign: "center", animation: "fadeIn 0.3s" }}>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 8 }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--red)", animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite` }} />
                  ))}
                </div>
                <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2 }}>CONNECTING...</div>
              </div>
            ) : (
              <Btn primary disabled={code.length < 4} onClick={handleJoin}>Join Game</Btn>
            )}
          </div>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

import { useState } from "react";
import { Phone, ScreenTransition, Btn } from "../ui";

const COLORS = ["#DC2626","#8B5CF6","#0EA5E9","#F59E0B","#10B981","#EC4899","#F97316","#6366F1"];

export default function JoinGame({ playerName, playerColor, onNameChange, onColorChange, onJoin, onBack }) {
  const [code, setCode] = useState("");
  const [connecting, setConnecting] = useState(false);

  const ready = playerName?.trim().length > 0 && code.length === 4;

  const handleJoin = () => {
    if (!ready) return;
    setConnecting(true);
    onJoin(code.toUpperCase());
  };

  return (
    <Phone>
      <ScreenTransition type="up">
        <div style={{ padding: "20px 24px 12px", display: "flex", alignItems: "center", gap: 12 }}>
          <div
            role="button"
            aria-label="Go back"
            tabIndex={0}
            onClick={onBack}
            onKeyDown={e => e.key === "Enter" && onBack()}
            style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--s1)", border: "1px solid var(--bdr)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "var(--txt-m)" }}
          >
            ←
          </div>
          <div style={{ fontFamily: "var(--fd)", fontSize: 28, letterSpacing: 2, lineHeight: 1 }}>JOIN GAME</div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", gap: 16 }}>
          <div style={{ animation: "fadeUp 0.4s ease-out" }}>
            {/* Name input */}
            <div style={{ background: "var(--s1)", borderRadius: 14, border: "1.5px solid var(--bdr)", padding: "4px", marginBottom: 12 }}>
              <input
                type="text"
                aria-label="Your display name"
                maxLength={16}
                value={playerName}
                onChange={e => onNameChange(e.target.value)}
                placeholder="Your name..."
                style={{ width: "100%", background: "transparent", border: "none", padding: "12px 16px", fontSize: 16, fontWeight: 500, color: "var(--txt)", outline: "none" }}
              />
            </div>

            {/* Colour picker */}
            <div role="radiogroup" aria-label="Choose your colour" style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
              {COLORS.map(c => (
                <div key={c} role="radio" aria-label={`Colour ${c}`} aria-checked={playerColor === c} tabIndex={0} onClick={() => onColorChange(c)} onKeyDown={e => e.key === "Enter" && onColorChange(c)} style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer", border: playerColor === c ? "2.5px solid white" : "2.5px solid transparent", boxShadow: playerColor === c ? `0 0 10px ${c}` : "none", transition: "all 0.15s" }} />
              ))}
            </div>

            {/* Room code label */}
            <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 16, textAlign: "center" }}>
              ENTER ROOM CODE
            </div>

            {/* 4-box code display */}
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
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

            {/* Hidden real input */}
            <input
              autoFocus
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))}
              onKeyDown={e => e.key === "Enter" && handleJoin()}
              style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
            />

            {/* Visible tap-to-type area */}
            <div
              onClick={() => document.querySelector("input[maxlength='4']")?.focus()}
              style={{ background: "var(--s1)", border: "1.5px solid var(--bdr)", borderRadius: 12, padding: "14px 16px", textAlign: "center", cursor: "text", marginBottom: 24, fontSize: 14, color: "var(--txt-d)" }}
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
              <Btn primary disabled={!ready} onClick={handleJoin}>Join Game</Btn>
            )}
          </div>
        </div>
      </ScreenTransition>
    </Phone>
  );
}

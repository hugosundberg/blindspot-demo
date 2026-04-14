import { useState, useEffect } from "react";
import { Phone } from "../ui";

export default function Countdown({ onNext }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) { setTimeout(onNext, 400); return; }
    const t = setTimeout(() => setCount(c => c - 1), 800);
    return () => clearTimeout(t);
  }, [count, onNext]);

  return (
    <Phone>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, var(--red-g) 0%, transparent 50%)", opacity: .6 }} />
        {count > 0 ? (
          <div key={count} style={{ animation: "scaleIn 0.4s ease-out", textAlign: "center", position: "relative" }}>
            <div style={{ fontFamily: "var(--fd)", fontSize: 120, color: "var(--red)", lineHeight: 1, textShadow: "0 0 60px var(--red-gs)" }}>{count}</div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 3, marginTop: 8 }}>GET READY</div>
          </div>
        ) : (
          <div style={{ animation: "scaleIn 0.3s ease-out", textAlign: "center", position: "relative" }}>
            <div style={{ fontFamily: "var(--fd)", fontSize: 48, color: "var(--txt)", letterSpacing: 6 }}>GO</div>
          </div>
        )}
      </div>
    </Phone>
  );
}

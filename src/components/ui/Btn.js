export default function Btn({ children, primary = false, danger = false, full = true, onClick, disabled = false, glow = false, style: sx = {} }) {
  const bg  = danger || primary ? "var(--red)" : "var(--s1)";
  const clr = primary || danger  ? "white"      : "var(--txt-m)";
  const shadow = primary || danger ? "0 4px 20px var(--red-g)" : "none";
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        width: full ? "100%" : "auto", padding: "14px 20px", borderRadius: 12,
        background: bg, border: primary || danger ? "none" : "1.5px solid var(--bdr)",
        color: clr, fontFamily: "var(--fb)", fontSize: 15, fontWeight: 600,
        cursor: disabled ? "default" : "pointer", letterSpacing: .5,
        boxShadow: shadow, opacity: disabled ? .5 : 1, transition: "all 0.2s",
        animation: glow ? "borderGlow 2s ease-in-out infinite" : "none",
        ...sx,
      }}
    >
      {children}
    </button>
  );
}

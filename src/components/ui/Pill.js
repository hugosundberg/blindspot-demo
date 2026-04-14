export default function Pill({ children, color = "var(--txt-d)", bg = "var(--s2)" }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 10px", borderRadius: 20, fontSize: 11,
      fontFamily: "var(--fm)", letterSpacing: .5, color, background: bg, fontWeight: 500,
    }}>
      {children}
    </span>
  );
}

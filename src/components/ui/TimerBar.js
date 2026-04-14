export default function TimerBar({ pct, color = "var(--red)" }) {
  return (
    <div style={{ height: 3, background: "var(--s2)", borderRadius: 2, overflow: "hidden", margin: "0 24px" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 2, transition: "width 0.5s linear" }} />
    </div>
  );
}

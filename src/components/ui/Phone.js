export default function Phone({ children, flash }) {
  return (
    <div style={{
      width: 390, minWidth: 390, maxWidth: 390,
      height: 760, minHeight: 760, maxHeight: 760,
      margin: "0 auto", background: "var(--bg)",
      borderRadius: 40, border: "2px solid var(--bdr)",
      overflow: "hidden", position: "relative",
      fontFamily: "var(--fb)", color: "var(--txt)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Status bar */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 28px 4px", fontSize: 13, fontWeight: 500,
        color: "var(--txt-m)", fontFamily: "var(--fm)", letterSpacing: .5, flexShrink: 0,
      }}>
        <span>21:37</span>
        <div style={{ width: 16, height: 10, border: "1.5px solid var(--txt-m)", borderRadius: 2, position: "relative" }}>
          <div style={{ position: "absolute", right: 1.5, top: 1.5, bottom: 1.5, left: "30%", background: "var(--txt-m)", borderRadius: 1 }} />
        </div>
      </div>

      {flash && (
        <div style={{
          position: "absolute", inset: 0, background: flash, zIndex: 100,
          animation: "flash 0.6s ease-out forwards", borderRadius: 40, pointerEvents: "none",
        }} />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minHeight: 0 }}>
        {children}
      </div>
    </div>
  );
}

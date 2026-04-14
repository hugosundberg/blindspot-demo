export default function FragmentCard({ text, label = "Your Fragment", accent = "var(--red)", verified = true }) {
  return (
    <div style={{
      background: "var(--s1)", border: "1px solid var(--bdr)",
      borderRadius: 16, padding: "28px 24px", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: 40, height: 3, background: accent, borderRadius: "0 0 2px 0" }} />
      <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: 40, background: accent }} />

      <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--fb)", fontSize: 21, fontWeight: 300, lineHeight: 1.5, color: "var(--txt)", letterSpacing: .3 }}>
        "{text}"
      </div>

      {verified !== null && (
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: verified ? "var(--grn)" : "var(--red)",
            boxShadow: `0 0 6px ${verified ? "var(--grn-g)" : "var(--red-g)"}`,
          }} />
          <span style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)" }}>
            {verified ? "Verified fragment" : "Poison fragment"}
          </span>
        </div>
      )}
    </div>
  );
}

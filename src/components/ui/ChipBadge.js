export default function ChipBadge({ chips, size = "md" }) {
  const s = size === "sm"
    ? { p: "4px 10px", fs: 13, dot: 6 }
    : { p: "6px 14px", fs: 16, dot: 8 };
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      background: "var(--s1)", borderRadius: 20, padding: s.p,
      border: "1px solid var(--bdr)",
    }}>
      <div style={{
        width: s.dot, height: s.dot, borderRadius: "50%",
        background: "var(--red)", boxShadow: "0 0 8px var(--red-g)",
      }} />
      <span style={{ fontFamily: "var(--fm)", fontSize: s.fs, fontWeight: 600 }}>{chips}</span>
    </div>
  );
}

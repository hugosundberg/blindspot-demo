export default function ActivityItem({ text, detail, time, i = 0 }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 14px", background: "var(--s1)", borderRadius: 10,
      border: "1px solid var(--bdr)", animation: `slideRight 0.3s ease-out ${i * 0.1}s both`,
    }}>
      <span style={{ fontSize: 13, color: "var(--txt-m)" }}>{text}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {detail && <span style={{ fontFamily: "var(--fm)", fontSize: 12, color: "var(--red)" }}>{detail}</span>}
        {time   && <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--txt-d)" }}>{time}</span>}
      </div>
    </div>
  );
}

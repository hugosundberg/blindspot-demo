import ChipBadge from "./ChipBadge";

export default function Hdr({ round, total, phase, chips }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 24px 12px" }}>
      <div>
        <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 2 }}>
          ROUND {round}/{total}
        </div>
        <div style={{ fontFamily: "var(--fd)", fontSize: 28, letterSpacing: 2, lineHeight: 1 }}>{phase}</div>
      </div>
      <ChipBadge chips={chips} />
    </div>
  );
}

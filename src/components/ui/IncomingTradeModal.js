import Avatar from "./Avatar";
import Btn from "./Btn";

export default function IncomingTradeModal({ from, amount, onAccept, onReject }) {
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 50, animation: "slideUp 0.35s ease-out" }}>
      <div style={{
        background: "var(--s1)", borderTop: "1.5px solid var(--bdr)",
        borderRadius: "20px 20px 0 0", padding: "24px",
      }}>
        <div style={{ width: 40, height: 4, background: "var(--s3)", borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <Avatar player={from} size={40} />
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{from.name} wants to buy</div>
            <div style={{ fontSize: 13, color: "var(--txt-m)" }}>Offering {amount} chips for your fragment</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn onClick={onReject} style={{ flex: 1 }}>Reject</Btn>
          <Btn primary onClick={onAccept} style={{ flex: 2 }}>Accept {amount} chips</Btn>
        </div>
      </div>
    </div>
  );
}

export default function Avatar({ player, size = 44, glow = false, onClick, muted = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        cursor: onClick ? "pointer" : "default", opacity: muted ? .35 : 1, transition: "all 0.2s",
      }}
    >
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `linear-gradient(135deg,${player.color}22,${player.color}44)`,
        border: `2px solid ${glow ? player.color : "var(--bdr)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--fd)", fontSize: size * .45, color: player.color, letterSpacing: 1,
        boxShadow: glow ? `0 0 20px ${player.color}33` : "none", transition: "all 0.3s",
      }}>
        {player.av}
      </div>
    </div>
  );
}

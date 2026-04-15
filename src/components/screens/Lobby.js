import { Phone, ScreenTransition, Avatar, Btn } from "../ui";

export default function Lobby({ roomCode, players = [], isHost, onNext, waiting }) {
  const canStart = isHost && players.length >= 3;

  return (
    <Phone>
      <ScreenTransition type="up">
        <div style={{ padding: "16px 24px 8px" }}>
          <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 4 }}>ROOM CODE</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {(roomCode || "----").split("").map((c, i) => (
              <div key={i} style={{
                width: 52, height: 60, background: "var(--s1)", border: "1.5px solid var(--bdr)",
                borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--fd)", fontSize: 32, color: "var(--txt)", letterSpacing: 2,
                animation: `scaleIn 0.3s ease-out ${i * 0.08}s both`,
              }}>{c}</div>
            ))}
          </div>
        </div>

        <div style={{ padding: "0 24px", flex: 1, overflow: "auto", minHeight: 0 }}>
          <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 12 }}>
            PLAYERS ({players.length}/8)
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {players.map((p) => (
              <div key={p.socketId} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                background: "var(--s1)", borderRadius: 14, border: "1px solid var(--bdr)",
                animation: "slideRight 0.4s ease-out",
              }}>
                <Avatar player={p} size={38} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</span>
                  {p.isHost && <span style={{ marginLeft: 8, fontFamily: "var(--fm)", fontSize: 10, color: "var(--amb)", letterSpacing: 1 }}>HOST</span>}
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--grn)", boxShadow: "0 0 8px var(--grn-g)" }} />
              </div>
            ))}
            {players.length < 3 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", borderRadius: 14, border: "1.5px dashed var(--bdr)" }}>
                <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--txt-d)", animation: `pulse 1.2s ease-in-out ${i * .3}s infinite` }} />)}
                </div>
                <span style={{ fontSize: 13, color: "var(--txt-d)" }}>Waiting for players...</span>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "12px 24px 28px" }}>
          {isHost ? (
            <Btn primary disabled={!canStart} onClick={onNext}>
              {canStart ? "Select Pack & Start" : `Need ${3 - players.length} more player${3 - players.length !== 1 ? "s" : ""}...`}
            </Btn>
          ) : (
            <div style={{ textAlign: "center", fontFamily: "var(--fm)", fontSize: 12, color: "var(--txt-d)", letterSpacing: 1 }}>
              {waiting || "Waiting for host to start..."}
            </div>
          )}
        </div>
      </ScreenTransition>
    </Phone>
  );
}

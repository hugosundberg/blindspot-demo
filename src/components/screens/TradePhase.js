import { useState, useEffect } from "react";
import { Phone, ScreenTransition, Hdr, TimerBar, Avatar, ChipBadge, ActivityItem, IncomingTradeModal, Btn } from "../ui";
import { useGame } from "../../context/GameContext";

export default function TradePhase({
  round, chips, players = [], mySocketId,
  collectedFragments = [],
  incomingOffers = [],
  tradeVotes = { votes: 0, total: 0 },
  onSendOffer, onAcceptOffer, onRejectOffer,
  onSteal, onVoteEnd,
}) {
  const { state } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [tradeAmt, setTradeAmt] = useState(3);
  const [showOffer, setShowOffer] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [activity, setActivity] = useState([]);
  const [timer, setTimer] = useState(100);
  const [myVote, setMyVote] = useState(false);

  // Trade window countdown (visual only — server is authoritative)
  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 0.25)), 225);
    return () => clearInterval(iv);
  }, []);

  // Append server trade activity to the log
  useEffect(() => {
    const off = () => {}; // activity comes via GameContext TRADE_ACTIVITY dispatch in App
    return off;
  }, []);

  // Pull TRADE_ACTIVITY events from GameContext into local log
  const tradeActivity = state.tradeActivity || [];
  useEffect(() => {
    if (tradeActivity.length > activity.length) {
      setActivity(tradeActivity);
    }
  }, [tradeActivity]); // eslint-disable-line

  // Dismiss offer panel when a steal is triggered
  const stealActive = !!state.stealState;
  const hasTraded   = state.hasTraded;
  const hasStolen   = state.hasStolen;

  const otherPlayers = players.filter(p => p.socketId !== mySocketId);

  const handleSendOffer = () => {
    if (!selectedPlayer || offerSent) return;
    setOfferSent(true);
    if (onSendOffer) onSendOffer(selectedPlayer.socketId, tradeAmt);
    setTimeout(() => {
      setSelectedPlayer(null);
      setShowOffer(false);
      setOfferSent(false);
    }, 1500);
  };

  // Active incoming offer (show the first one)
  const activeOffer = incomingOffers[0] || null;

  if (!round) return null;

  return (
    <Phone>
      <ScreenTransition type="fade">
        <Hdr round={round.roundNum} total={round.totalRounds} phase="TRADE" chips={chips} />
        <TimerBar pct={timer} color={timer < 30 ? "var(--amb)" : "var(--red)"} />

        <div style={{ flex: 1, padding: "12px 24px", display: "flex", flexDirection: "column", gap: 12, overflow: "auto", minHeight: 0, position: "relative" }}>
          {/* Player grid */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(otherPlayers.length, 3)}, 1fr)`, gap: 10 }}>
            {otherPlayers.map((p, i) => (
              <div key={p.socketId} onClick={() => { if (!stealActive) { setSelectedPlayer(p); setShowOffer(true); } }} style={{
                background: selectedPlayer?.socketId === p.socketId ? `${p.color}12` : "var(--s1)",
                border: `1.5px solid ${selectedPlayer?.socketId === p.socketId ? p.color : "var(--bdr)"}`,
                borderRadius: 14, padding: "14px 10px", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6, cursor: stealActive ? "default" : "pointer", transition: "all 0.2s",
                animation: `fadeUp 0.3s ease-out ${i * 0.06}s both`,
                opacity: stealActive ? 0.5 : 1,
              }}>
                <Avatar player={p} size={40} glow={selectedPlayer?.socketId === p.socketId} />
                <span style={{ fontSize: 12, fontWeight: 500 }}>{p.name}</span>
                <ChipBadge chips={p.chips} size="sm" />
              </div>
            ))}
          </div>

          {/* Trade panel */}
          {showOffer && selectedPlayer && !activeOffer && !stealActive && (
            <div style={{ background: "var(--s1)", border: "1px solid var(--bdr)", borderRadius: 14, padding: 18, animation: "fadeUp 0.3s ease-out" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar player={selectedPlayer} size={30} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Buy from {selectedPlayer.name}</span>
                </div>
                <div onClick={() => setShowOffer(false)} style={{ color: "var(--txt-d)", cursor: "pointer", fontSize: 16, padding: 4 }}>✕</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 20, margin: "8px 0 16px" }}>
                <div onClick={() => setTradeAmt(Math.max(1, tradeAmt - 1))} style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--s2)", border: "1px solid var(--bdr)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "var(--txt-m)" }}>−</div>
                <div style={{ fontFamily: "var(--fd)", fontSize: 46, color: "var(--red)", lineHeight: 1, minWidth: 50, textAlign: "center", textShadow: "0 0 20px var(--red-g)" }}>{tradeAmt}</div>
                <div onClick={() => setTradeAmt(Math.min(10, tradeAmt + 1))} style={{ width: 34, height: 34, borderRadius: "50%", background: "var(--s2)", border: "1px solid var(--bdr)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, color: "var(--txt-m)" }}>+</div>
              </div>
              <Btn primary onClick={handleSendOffer} disabled={offerSent || chips < tradeAmt}>
                {offerSent ? "Offer sent..." : chips < tradeAmt ? "Not enough chips" : "Send Offer"}
              </Btn>
            </div>
          )}

          {/* Fragments collected so far */}
          {collectedFragments.length > 0 && (
            <div style={{ background: "var(--s1)", border: "1px solid var(--bdr)", borderRadius: 12, padding: 12 }}>
              <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 8 }}>FRAGMENTS</div>
              {collectedFragments.map((f, i) => (
                <div key={i} style={{ padding: "6px 10px", background: "var(--s2)", borderRadius: 8, fontSize: 12, color: "var(--txt-m)", borderLeft: `2px solid ${f.isPoison ? "var(--amb)" : f.isOwn ? "var(--red)" : "#0EA5E9"}`, marginBottom: 4 }}>
                  "{f.fragment}"
                </div>
              ))}
            </div>
          )}

          {/* Activity log */}
          <div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--txt-d)", letterSpacing: 2, marginBottom: 6 }}>ACTIVITY</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {activity.map((a, i) => <ActivityItem key={i} text={a.text} detail={a.detail} time={a.time} i={i} />)}
              {activity.length === 0 && <div style={{ fontSize: 12, color: "var(--txt-d)", padding: 12, textAlign: "center" }}>No trades yet...</div>}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div style={{ padding: "8px 24px 28px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn danger onClick={onSteal} disabled={stealActive || hasTraded || hasStolen} style={{ flex: 1, animation: (stealActive || hasTraded || hasStolen) ? "none" : "borderGlow 2s ease-in-out infinite", background: "transparent", border: `2px solid ${(stealActive || hasTraded || hasStolen) ? "var(--bdr)" : "var(--red)"}`, color: (stealActive || hasTraded || hasStolen) ? "var(--txt-d)" : "var(--red)" }}>
              ⚡ STEAL
            </Btn>
            <Btn
              onClick={() => { if (!myVote && !stealActive) { setMyVote(true); if (onVoteEnd) onVoteEnd(); } }}
              disabled={myVote || stealActive}
              style={{ flex: 1, background: myVote ? "rgba(14,165,233,0.08)" : "transparent", border: `2px solid ${myVote ? "#0EA5E9" : "var(--bdr)"}`, color: myVote ? "#0EA5E9" : "var(--txt-d)" }}
            >
              {myVote ? `✓ ${tradeVotes.votes}/${tradeVotes.total}` : "Done Trading"}
            </Btn>
          </div>
          {tradeVotes.votes > 0 && (
            <div style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--txt-d)", letterSpacing: 2, textAlign: "center" }}>
              {tradeVotes.votes}/{tradeVotes.total} READY TO ANSWER
            </div>
          )}
        </div>

        {/* Incoming trade modal */}
        {activeOffer && (
          <IncomingTradeModal
            from={activeOffer.fromPlayer}
            amount={activeOffer.chipAmount}
            onAccept={() => onAcceptOffer(activeOffer.offerId)}
            onReject={() => onRejectOffer(activeOffer.offerId)}
          />
        )}
      </ScreenTransition>
    </Phone>
  );
}

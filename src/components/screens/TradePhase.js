import { useState, useEffect } from "react";
import { Phone, ScreenTransition, Hdr, TimerBar, Avatar, ChipBadge, ActivityItem, IncomingTradeModal, Btn } from "../ui";
import { PLAYERS_DATA } from "../../data/constants";

export default function TradePhase({ round, chips, onAnswer, onSteal, onChipChange, showIncoming = false }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [tradeAmt, setTradeAmt] = useState(3);
  const [showOffer, setShowOffer] = useState(false);
  const [incomingVisible, setIncomingVisible] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [activity, setActivity] = useState([]);
  const [timer, setTimer] = useState(100);

  useEffect(() => {
    const iv = setInterval(() => setTimer(t => Math.max(0, t - 0.5)), 300);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setActivity(a => [...a, { text: "Mia is looking around...", time: "0:04" }]), 2000);
    const t2 = setTimeout(() => setActivity(a => [...a, { text: "Kai bought from Zoe", detail: "2 chips", time: "0:08" }]), 4000);
    const t3 = showIncoming ? setTimeout(() => setIncomingVisible(true), 5500) : null;
    return () => { clearTimeout(t1); clearTimeout(t2); if (t3) clearTimeout(t3); };
  }, [showIncoming]);

  const handleSendOffer = () => {
    setOfferSent(true);
    setActivity(a => [...a, { text: `You offered ${selectedPlayer.name}`, detail: `${tradeAmt} chips`, time: "0:12" }]);
    setTimeout(() => {
      // Deduct chips for the accepted trade
      if (onChipChange) onChipChange(-tradeAmt);
      setActivity(a => [...a, { text: `${selectedPlayer.name} accepted!`, detail: "Fragment revealed", time: "0:15" }]);
      setSelectedPlayer(null);
      setShowOffer(false);
      setOfferSent(false);
    }, 1500);
  };

  return (
    <Phone>
      <ScreenTransition type="fade">
        <Hdr round={round.num} total={15} phase="TRADE" chips={chips} />
        <TimerBar pct={timer} color={timer < 30 ? "var(--amb)" : "var(--red)"} />

        <div style={{ flex: 1, padding: "12px 24px", display: "flex", flexDirection: "column", gap: 12, overflow: "auto", minHeight: 0, position: "relative" }}>
          {/* Player grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {PLAYERS_DATA.slice(1).map((p, i) => (
              <div key={p.id} onClick={() => { setSelectedPlayer(p); setShowOffer(true); }} style={{
                background: selectedPlayer?.id === p.id ? `${p.color}12` : "var(--s1)",
                border: `1.5px solid ${selectedPlayer?.id === p.id ? p.color : "var(--bdr)"}`,
                borderRadius: 14, padding: "14px 10px", display: "flex", flexDirection: "column",
                alignItems: "center", gap: 6, cursor: "pointer", transition: "all 0.2s",
                animation: `fadeUp 0.3s ease-out ${i * 0.06}s both`,
              }}>
                <Avatar player={p} size={40} glow={selectedPlayer?.id === p.id} />
                <span style={{ fontSize: 12, fontWeight: 500 }}>{p.name}</span>
                <ChipBadge chips={p.chips} size="sm" />
              </div>
            ))}
          </div>

          {/* Trade panel */}
          {showOffer && selectedPlayer && !incomingVisible && (
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
              <Btn primary onClick={handleSendOffer} disabled={offerSent}>
                {offerSent ? "Offer sent..." : "Send Offer"}
              </Btn>
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
        <div style={{ padding: "8px 24px 28px", display: "flex", gap: 10 }}>
          <Btn onClick={onAnswer} style={{ flex: 1 }}>Answer</Btn>
          <Btn danger onClick={onSteal} style={{ flex: 2, animation: "borderGlow 2s ease-in-out infinite", background: "transparent", border: "2px solid var(--red)", color: "var(--red)" }}>⚡ STEAL</Btn>
        </div>

        {incomingVisible && (
          <IncomingTradeModal
            from={PLAYERS_DATA[1]}
            amount={3}
            onAccept={() => {
              setIncomingVisible(false);
              // Add chips for accepted incoming trade
              if (onChipChange) onChipChange(3);
              setActivity(a => [...a, { text: "You sold to Mia", detail: "+3 chips", time: "0:18" }]);
            }}
            onReject={() => setIncomingVisible(false)}
          />
        )}
      </ScreenTransition>
    </Phone>
  );
}

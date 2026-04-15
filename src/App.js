import { useState, useEffect } from "react";
import {
  Splash, JoinGame, Lobby, PackSelect, Countdown,
  ReadPhase, TradePhase, AnswerPhase, RoundResult,
  StealSequence, Leaderboard,
} from "./components/screens";
import { GameProvider, useGame } from "./context/GameContext";
import { useSocket } from "./hooks/useSocket";

/* ─────────────────────────────────────────────
   AppController — inside GameProvider so it can
   read/write context and register socket events.
───────────────────────────────────────────── */
function AppController() {
  const { state, dispatch } = useGame();
  const { socket, emit, on } = useSocket();

  // Pre-game identity (name + colour chosen before creating/joining)
  const [playerName,  setPlayerName]  = useState("");
  const [playerColor, setPlayerColor] = useState("#DC2626");
  const [joinFlow,    setJoinFlow]    = useState(false);
  const [error,       setError]       = useState(null);

  /* ─── Register all socket → dispatch listeners once ─── */
  useEffect(() => {
    const offs = [
      on("connect",        ()       => dispatch({ type: "SET_IDENTITY", socketId: socket.id, playerId: null, name: playerName, color: playerColor })),

      on("ROOM_CREATED",   (data)   => { dispatch({ type: "ROOM_CREATED",  ...data }); dispatch({ type: "SET_HOST", isHost: true }); }),
      on("JOIN_ACK",       (data)   => { if (data.ok) { dispatch({ type: "JOIN_ACK", ...data }); setJoinFlow(false); } else { setError(data.error); } }),
      on("PLAYER_JOINED",  (data)   => dispatch({ type: "PLAYER_JOINED",  ...data })),
      on("PLAYER_LEFT",    (data)   => dispatch({ type: "PLAYER_LEFT",    ...data })),
      on("PACK_SELECTED",  (data)   => dispatch({ type: "PACK_SELECTED",  ...data })),
      on("GAME_STARTING",  (data)   => dispatch({ type: "GAME_STARTING",  ...data })),

      on("ROUND_START",    (data)   => { dispatch({ type: "ROUND_START",    ...data }); }),
      on("PLAYERS_STATUS", (data)   => dispatch({ type: "PLAYERS_STATUS",  ...data })),
      on("TRADE_PHASE_START",  (d) => dispatch({ type: "TRADE_PHASE_START",  ...d })),
      on("TRADE_PHASE_END",   ()  => dispatch({ type: "TRADE_PHASE_END" })),
      on("TRADE_VOTE_UPDATE", (d) => dispatch({ type: "TRADE_VOTE_UPDATE", ...d })),

      on("OFFER_RECEIVED", (data)  => dispatch({ type: "OFFER_RECEIVED",  ...data })),
      on("OFFER_ACCEPTED", (data)  => dispatch({ type: "OFFER_ACCEPTED",  ...data })),
      on("OFFER_REJECTED", (data)  => dispatch({ type: "OFFER_REJECTED",  ...data })),
      on("CHIPS_UPDATED",  (data)  => dispatch({ type: "CHIPS_UPDATED",   ...data })),
      on("TRADE_ACTIVITY", (data)  => dispatch({ type: "TRADE_ACTIVITY",  ...data })),

      on("STEAL_INITIATED", (data) => dispatch({ type: "STEAL_INITIATED", ...data })),
      on("STEAL_RESULT",    (data) => dispatch({ type: "STEAL_RESULT",    ...data })),
      on("STEAL_TIMEOUT",   (data) => dispatch({ type: "STEAL_TIMEOUT",   ...data })),

      on("ANSWER_PHASE_START", (d) => dispatch({ type: "ANSWER_PHASE_START", ...d })),
      on("ANSWER_RECEIVED",    (d) => dispatch({ type: "ANSWER_RECEIVED",    ...d })),
      on("ROUND_RESULT",       (d) => dispatch({ type: "ROUND_RESULT",       ...d })),
      on("LEADERBOARD",        (d) => dispatch({ type: "LEADERBOARD",        ...d })),
      on("ROOM_ERROR",         (d) => setError(d.message)),
    ];
    return () => offs.forEach(off => off());
  }, []); // eslint-disable-line

  /* ─── Helpers that emit to the server ─── */
  const handleCreateGame = () => {
    if (!playerName.trim()) return;
    emit("CREATE_ROOM", {
      name: playerName.trim(),
      avatarChar: playerName.trim()[0].toUpperCase(),
      color: playerColor,
    });
  };

  const handleJoinGame = (code) => {
    if (!playerName.trim()) return;
    emit("JOIN_ROOM", {
      roomCode: code.toUpperCase(),
      name: playerName.trim(),
      avatarChar: playerName.trim()[0].toUpperCase(),
      color: playerColor,
    });
  };

  const handlePackStart = (pack, totalRounds) => {
    emit("SELECT_PACK", { pack, totalRounds });
    emit("START_GAME", {});
  };

  const handleReadyToTrade  = () => emit("READY_TO_TRADE",   {});
  const handleVoteEndTrade  = () => emit("VOTE_END_TRADE",   {});

  const handleSendOffer    = (toSocketId, chipAmount) => emit("SEND_OFFER",   { toSocketId, chipAmount });
  const handleAcceptOffer  = (offerId)                => emit("ACCEPT_OFFER", { offerId });
  const handleRejectOffer  = (offerId)                => emit("REJECT_OFFER", { offerId });
  const handleTriggerSteal = ()                       => emit("TRIGGER_STEAL", {});

  const handleSubmitSteal  = (answer)  => emit("SUBMIT_STEAL",  { answer });
  const handleSubmitAnswer = (answer)  => emit("SUBMIT_ANSWER", { answer });
  const handlePass         = ()        => emit("PASS", {});

  const handleRestart = () => {
    dispatch({ type: "RESET" });
    setError(null);
  };

  /* ─── Derive convenient shorthand ─── */
  const { phase, myChips, currentRound, lastResult, leaderboard, players, roomCode, isHost, stealState } = state;

  /* ─── Render the right screen for each phase ─── */
  const renderScreen = () => {

    // Pre-game: user hasn't created/joined yet
    if (!roomCode && !joinFlow) {
      return (
        <Splash
          playerName={playerName}
          playerColor={playerColor}
          onNameChange={setPlayerName}
          onColorChange={setPlayerColor}
          onNext={handleCreateGame}
          onJoin={() => setJoinFlow(true)}
        />
      );
    }

    if (joinFlow) {
      return (
        <JoinGame
          playerName={playerName}
          playerColor={playerColor}
          onNameChange={setPlayerName}
          onColorChange={setPlayerColor}
          onJoin={handleJoinGame}
          onBack={() => setJoinFlow(false)}
        />
      );
    }

    switch (phase) {
      case "lobby":
        return (
          <Lobby
            roomCode={roomCode}
            players={players}
            isHost={isHost}
            onNext={() => dispatch({ type: "CLIENT_PHASE", phase: "pack_select" })}
          />
        );

      case "pack_select":
        return isHost
          ? <PackSelect onNext={handlePackStart} />
          : <Lobby roomCode={roomCode} players={players} isHost={false} waiting="Waiting for host to select pack..." />;

      case "countdown":
        return <Countdown onNext={() => {}} />;

      case "read":
        return (
          <ReadPhase
            round={currentRound}
            chips={myChips}
            players={players}
            onNext={handleReadyToTrade}
          />
        );

      case "trade":
        return (
          <TradePhase
            round={currentRound}
            chips={myChips}
            players={players}
            mySocketId={socket.id}
            collectedFragments={state.collectedFragments}
            incomingOffers={state.tradeOffers}
            tradeVotes={state.tradeVotes}
            onSendOffer={handleSendOffer}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
            onSteal={handleTriggerSteal}
            onVoteEnd={handleVoteEndTrade}
          />
        );

      case "steal":
        return (
          <StealSequence
            round={currentRound}
            stealState={stealState}
            mySocketId={socket.id}
            players={players}
            onSubmitSteal={handleSubmitSteal}
          />
        );

      case "steal_result": {
        const result = stealState?.result;
        return (
          <StealSequence
            round={currentRound}
            stealState={{ ...stealState, result }}
            mySocketId={socket.id}
            players={players}
            onSubmitSteal={handleSubmitSteal}
          />
        );
      }

      case "answer":
        return (
          <AnswerPhase
            round={currentRound}
            chips={myChips}
            collectedFragments={state.collectedFragments}
            answeredPlayers={state.answeredPlayers}
            players={players}
            onSubmit={handleSubmitAnswer}
            onPass={handlePass}
          />
        );

      case "result":
        return (
          <RoundResult
            round={currentRound}
            result={lastResult}
            mySocketId={socket.id}
            chips={myChips}
            players={players}
          />
        );

      case "leaderboard":
        return (
          <Leaderboard
            leaderboard={leaderboard}
            mySocketId={socket.id}
            onRestart={handleRestart}
          />
        );

      default:
        return <Splash playerName={playerName} onNameChange={setPlayerName} onNext={handleCreateGame} onJoin={() => setJoinFlow(true)} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050506", fontFamily: "var(--fb)",
      display: "flex", flexDirection: "column", alignItems: "center",
      paddingTop: 16, paddingBottom: 16,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--fd)", fontSize: 22, letterSpacing: 6, color: "#DC2626", textShadow: "0 0 20px rgba(220,38,38,0.3)" }}>BLINDSPOT</span>
        <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "#44444F", letterSpacing: 2, border: "1px solid #2A2A32", padding: "2px 8px", borderRadius: 4 }}>BETA</span>
        {roomCode && (
          <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "#DC2626", letterSpacing: 2, border: "1px solid #2A2A32", padding: "2px 8px", borderRadius: 4 }}>
            {roomCode}
          </span>
        )}
      </div>

      {/* Error toast */}
      {error && (
        <div onClick={() => setError(null)} style={{
          background: "rgba(220,38,38,0.12)", border: "1px solid var(--red)", borderRadius: 8,
          padding: "8px 16px", marginBottom: 8, fontSize: 13, color: "var(--red)", cursor: "pointer",
          maxWidth: 390,
        }}>
          {error} — tap to dismiss
        </div>
      )}

      {/* Screen */}
      <div key={phase} style={{ width: 390, height: 760, flexShrink: 0 }}>
        {renderScreen()}
      </div>

      <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#44444F", letterSpacing: 1, textAlign: "center", padding: "0 20px" }}>
        PHASE: {phase.toUpperCase()} • CHIPS: {myChips} {roomCode ? `• ROOM: ${roomCode}` : ""}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppController />
    </GameProvider>
  );
}

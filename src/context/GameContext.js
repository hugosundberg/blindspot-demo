import { createContext, useContext, useReducer, useCallback } from "react";

const GameContext = createContext(null);

const initialState = {
  // Identity
  mySocketId: null,
  myPlayerId: null,
  myName: null,
  myColor: null,

  // Room
  roomCode: null,
  isHost: false,
  players: [],         // array of PlayerPublic objects (from server)

  // Settings (chosen in lobby/pack select)
  pack: "Mixed",
  totalRounds: 15,

  // Round state
  roundIndex: 0,
  currentRound: null,  // { num, totalRounds, category, questionType, fragment, isPoison }
  phase: "lobby",      // lobby | countdown | read | trade | answer | steal | result | leaderboard

  // My chips (authoritative copy from server CHIPS_UPDATED events)
  myChips: 10,

  // Fragments I've collected this round via trades
  collectedFragments: [],

  // Trade state
  tradeOffers: [],     // incoming offers: { offerId, fromPlayer, chipAmount }
  tradeActivity: [],   // log entries: { text, detail, timestamp }
  hasTraded: false,    // true once this player is party to any accepted trade this round
  tradeVotes: { votes: 0, total: 0 }, // players who have voted to end trade early

  // Steal state
  stealState: null,    // { stealerSocketId, stealerPlayer, durationMs } | null
  hasStolen: false,    // true if the current player attempted a steal this round

  // Answer phase
  answeredPlayers: [], // socketIds that have locked in

  // Result
  lastResult: null,    // { questionAnswer, chipDeltas, players, poisonReveal? }

  // Final leaderboard
  leaderboard: null,
};

function reducer(state, action) {
  switch (action.type) {

    case "SET_IDENTITY":
      return { ...state, mySocketId: action.socketId, myPlayerId: action.playerId, myName: action.name, myColor: action.color };

    case "ROOM_CREATED":
    case "JOIN_ACK":
      return { ...state, roomCode: action.roomCode, players: action.players };

    case "PLAYER_JOINED":
      return { ...state, players: [...state.players.filter(p => p.socketId !== action.player.socketId), action.player] };

    case "PLAYER_LEFT":
      return {
        ...state,
        players: action.players,
        isHost: action.newHostId === state.mySocketId ? true : state.isHost,
      };

    case "SET_HOST":
      return { ...state, isHost: action.isHost };

    case "PACK_SELECTED":
      return { ...state, pack: action.pack, totalRounds: action.totalRounds };

    case "GAME_STARTING":
      return { ...state, phase: "countdown", players: action.players, myChips: 10 };

    case "ROUND_START":
      return {
        ...state,
        phase: "read",
        currentRound: action,
        collectedFragments: [{ fragment: action.fragment, isOwn: true, isPoison: action.isPoison }],
        stealState: null,
        hasStolen: false,
        answeredPlayers: [],
        lastResult: null,
        tradeActivity: [],
        tradeOffers: [],
        hasTraded: false,
        tradeVotes: { votes: 0, total: 0 },
        myChips: state.myChips, // keep current chips
      };

    case "PLAYERS_STATUS":
      return { ...state, players: action.players };

    case "TRADE_PHASE_START":
      return { ...state, phase: "trade", stealState: null, tradeVotes: { votes: 0, total: 0 } };

    case "TRADE_VOTE_UPDATE":
      return { ...state, tradeVotes: { votes: action.votes, total: action.total } };

    case "OFFER_RECEIVED":
      return { ...state, tradeOffers: [...state.tradeOffers, action] };

    case "OFFER_ACCEPTED": {
      const newOffers = state.tradeOffers.filter(o => o.offerId !== action.offerId);
      const frags = action.fragment
        ? [...state.collectedFragments, { fragment: action.fragment, isOwn: false }]
        : state.collectedFragments;
      return { ...state, tradeOffers: newOffers, collectedFragments: frags, hasTraded: true };
    }

    case "OFFER_REJECTED":
      return { ...state, tradeOffers: state.tradeOffers.filter(o => o.offerId !== action.offerId) };

    case "CHIPS_UPDATED": {
      if (action.socketId !== state.mySocketId) {
        // Update the chip count in the players array for other players
        return {
          ...state,
          players: state.players.map(p =>
            p.socketId === action.socketId ? { ...p, chips: action.chips } : p
          ),
        };
      }
      return {
        ...state,
        myChips: action.chips,
        players: state.players.map(p =>
          p.socketId === action.socketId ? { ...p, chips: action.chips } : p
        ),
      };
    }

    case "TRADE_ACTIVITY":
      return { ...state, tradeActivity: [...state.tradeActivity, { text: action.text, detail: action.detail, timestamp: action.timestamp }] };

    case "STEAL_INITIATED":
      return {
        ...state,
        phase: "steal",
        stealState: action,
        hasStolen: state.hasStolen || action.stealerSocketId === state.mySocketId,
      };

    case "TRADE_PHASE_END":
      return { ...state, phase: "answer" };

    case "ANSWER_PHASE_START":
      return { ...state, phase: "answer" };

    case "ANSWER_RECEIVED":
      return { ...state, answeredPlayers: [...state.answeredPlayers, action.socketId] };

    case "STEAL_RESULT":
    case "STEAL_TIMEOUT":
      return { ...state, phase: "steal_result", stealState: { ...state.stealState, result: action } };

    case "ROUND_RESULT":
      return { ...state, phase: "result", lastResult: action };

    case "LEADERBOARD":
      return { ...state, phase: "leaderboard", leaderboard: action };

    case "CLIENT_PHASE":
      return { ...state, phase: action.phase };

    case "RESET":
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const update = useCallback((action) => dispatch(action), []);

  return (
    <GameContext.Provider value={{ state, dispatch: update }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within a GameProvider");
  return ctx;
}

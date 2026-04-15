const { ROOM_CODE_CHARS, ROOM_CODE_LENGTH, STARTING_CHIPS } = require("./config");

// Map<roomCode, Room>
const rooms = new Map();

function generateCode() {
  let code;
  do {
    code = Array.from({ length: ROOM_CODE_LENGTH }, () =>
      ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)]
    ).join("");
  } while (rooms.has(code));
  return code;
}

function createRoom(hostSocketId, hostPlayer) {
  const code = generateCode();
  const room = {
    code,
    hostSocketId,
    phase: "lobby",
    roundIndex: 0,
    totalRounds: 15,
    pack: "Mixed",
    rounds: [],          // populated by gameEngine when game starts
    currentRound: null,
    stealState: null,
    phaseTimer: null,
    answerBuffer: new Map(),   // socketId → { answer, submittedAt }
    tradeOffers: new Map(),    // offerId → TradeOffer
    endTradeVotes: new Set(),  // socketIds that have voted to end trade early
    players: new Map(),        // socketId → Player
  };
  room.players.set(hostSocketId, { ...hostPlayer, isHost: true });
  rooms.set(code, room);
  return room;
}

function getRoom(code) {
  return rooms.get(code) || null;
}

function getRoomBySocket(socketId) {
  for (const room of rooms.values()) {
    if (room.players.has(socketId)) return room;
  }
  return null;
}

function addPlayer(room, socketId, player) {
  room.players.set(socketId, { ...player, isHost: false });
}

function removePlayer(room, socketId) {
  room.players.delete(socketId);
  // If the host left, promote the next player
  if (room.hostSocketId === socketId && room.players.size > 0) {
    const newHostId = room.players.keys().next().value;
    room.hostSocketId = newHostId;
    room.players.get(newHostId).isHost = true;
    return newHostId;
  }
  if (room.players.size === 0) {
    rooms.delete(room.code);
  }
  return null;
}

function deleteRoom(code) {
  rooms.delete(code);
}

/** Returns a public-safe array of player objects (no fragment, no isPoison). */
function publicPlayers(room) {
  return Array.from(room.players.values()).map(publicPlayer);
}

function publicPlayer(p) {
  const { fragment, isPoison, ...pub } = p;
  return pub;
}

module.exports = {
  createRoom, getRoom, getRoomBySocket, addPlayer, removePlayer, deleteRoom,
  publicPlayers, publicPlayer,
};

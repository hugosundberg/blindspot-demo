const { MIN_PLAYERS, STARTING_CHIPS } = require("../config");
const rm = require("../roomManager");
const { selectRounds } = require("../gameEngine");
const { startReadTimer } = require("../timers");
const { startRound } = require("./readHandlers");

function registerLobbyHandlers(io, socket) {

  socket.on("SELECT_PACK", ({ pack, totalRounds }) => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room || room.hostSocketId !== socket.id) return;
    if (room.phase !== "lobby") return;
    room.pack = pack || "Mixed";
    room.totalRounds = [10, 15, 20].includes(totalRounds) ? totalRounds : 15;
    io.to(room.code).emit("PACK_SELECTED", { pack: room.pack, totalRounds: room.totalRounds });
  });

  socket.on("START_GAME", () => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room || room.hostSocketId !== socket.id) return;
    if (room.phase !== "lobby") return;
    if (room.players.size < MIN_PLAYERS) {
      return socket.emit("ROOM_ERROR", { code: "NOT_ENOUGH_PLAYERS", message: `Need at least ${MIN_PLAYERS} players.` });
    }

    // Reset chips for all players
    for (const p of room.players.values()) {
      p.chips = STARTING_CHIPS;
    }

    room.rounds = selectRounds(room.pack, room.totalRounds);
    room.roundIndex = 0;
    room.phase = "countdown";

    io.to(room.code).emit("GAME_STARTING", {
      countdownMs: 3000,
      players: rm.publicPlayers(room),
    });

    // After countdown, start round 1
    setTimeout(() => startRound(io, room), 3200);
  });
}

module.exports = { registerLobbyHandlers };

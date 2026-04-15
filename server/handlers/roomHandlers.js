const { v4: uuidv4 } = require("uuid");
const { STARTING_CHIPS, MIN_PLAYERS, MAX_PLAYERS } = require("../config");
const rm = require("../roomManager");

function registerRoomHandlers(io, socket) {

  socket.on("CREATE_ROOM", ({ name, avatarChar, color }) => {
    const player = {
      socketId: socket.id,
      playerId: uuidv4(),
      name: name || "Player",
      avatarChar: (avatarChar || name?.[0] || "P").toUpperCase(),
      color: color || "#DC2626",
      chips: STARTING_CHIPS,
      isHost: true,
      fragment: null,
      isPoison: false,
      stats: { correct: 0, steals: 0, poisonSold: 0 },
    };
    const room = rm.createRoom(socket.id, player);
    socket.join(room.code);
    socket.emit("ROOM_CREATED", {
      roomCode: room.code,
      playerId: player.playerId,
      players: rm.publicPlayers(room),
    });
  });

  socket.on("JOIN_ROOM", ({ roomCode, name, avatarChar, color }) => {
    const room = rm.getRoom(roomCode?.toUpperCase());
    if (!room) {
      return socket.emit("ROOM_ERROR", { code: "ROOM_NOT_FOUND", message: "Room not found." });
    }
    if (room.phase !== "lobby") {
      return socket.emit("ROOM_ERROR", { code: "GAME_IN_PROGRESS", message: "Game already started." });
    }
    if (room.players.size >= MAX_PLAYERS) {
      return socket.emit("ROOM_ERROR", { code: "ROOM_FULL", message: "Room is full." });
    }
    const player = {
      socketId: socket.id,
      playerId: uuidv4(),
      name: name || "Player",
      avatarChar: (avatarChar || name?.[0] || "P").toUpperCase(),
      color: color || "#8B5CF6",
      chips: STARTING_CHIPS,
      isHost: false,
      fragment: null,
      isPoison: false,
      stats: { correct: 0, steals: 0, poisonSold: 0 },
    };
    rm.addPlayer(room, socket.id, player);
    socket.join(roomCode.toUpperCase());
    socket.emit("JOIN_ACK", { ok: true, playerId: player.playerId, roomCode: room.code, players: rm.publicPlayers(room) });
    socket.to(room.code).emit("PLAYER_JOINED", { player: rm.publicPlayer(player) });
  });

  socket.on("LEAVE_ROOM", () => {
    handleDisconnect(io, socket);
  });

  socket.on("disconnect", () => {
    handleDisconnect(io, socket);
  });
}

function handleDisconnect(io, socket) {
  const room = rm.getRoomBySocket(socket.id);
  if (!room) return;
  const newHostId = rm.removePlayer(room, socket.id);
  socket.leave(room.code);
  io.to(room.code).emit("PLAYER_LEFT", {
    playerId: socket.id,
    newHostId: newHostId || null,
    players: rm.publicPlayers(room),
  });
}

module.exports = { registerRoomHandlers };

const rm = require("../roomManager");
const { flushAnswers } = require("./readHandlers");

function registerAnswerHandlers(io, socket) {

  socket.on("SUBMIT_ANSWER", ({ answer }) => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room || room.phase !== "answer") return;

    // Idempotency: ignore duplicate submissions
    if (room.answerBuffer.has(socket.id)) return;

    room.answerBuffer.set(socket.id, { answer, submittedAt: Date.now() });

    // Broadcast that this player locked in (without revealing the answer text)
    io.to(room.code).emit("ANSWER_RECEIVED", { socketId: socket.id });

    // If all players have submitted, resolve immediately
    if (room.answerBuffer.size >= room.players.size) {
      flushAnswers(io, room);
    }
  });

  socket.on("PASS", () => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room || room.phase !== "answer") return;
    if (room.answerBuffer.has(socket.id)) return;

    room.answerBuffer.set(socket.id, { answer: null, submittedAt: Date.now() });
    io.to(room.code).emit("ANSWER_RECEIVED", { socketId: socket.id });

    if (room.answerBuffer.size >= room.players.size) {
      flushAnswers(io, room);
    }
  });
}

module.exports = { registerAnswerHandlers };

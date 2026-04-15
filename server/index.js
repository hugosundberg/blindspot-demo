const http    = require("http");
const { Server } = require("socket.io");
const { PORT }   = require("./config");
const { registerRoomHandlers }   = require("./handlers/roomHandlers");
const { registerLobbyHandlers }  = require("./handlers/lobbyHandlers");
const { registerReadHandlers }   = require("./handlers/readHandlers");
const { registerTradeHandlers }  = require("./handlers/tradeHandlers");
const { registerStealHandlers }  = require("./handlers/stealHandlers");
const { registerAnswerHandlers } = require("./handlers/answerHandlers");

const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Blindspot server running");
});

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`[+] ${socket.id} connected`);

  registerRoomHandlers(io, socket);
  registerLobbyHandlers(io, socket);
  registerReadHandlers(io, socket);
  registerTradeHandlers(io, socket);
  registerStealHandlers(io, socket);
  registerAnswerHandlers(io, socket);

  socket.on("disconnect", () => {
    console.log(`[-] ${socket.id} disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`Blindspot server listening on port ${PORT}`);
});

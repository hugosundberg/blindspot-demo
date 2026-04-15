const { v4: uuidv4 } = require("uuid");
const rm = require("../roomManager");
const { canAfford, transfer } = require("../chipLedger");

function registerTradeHandlers(io, socket) {

  socket.on("SEND_OFFER", ({ toSocketId, chipAmount }) => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room || room.phase !== "trade") {
      return socket.emit("ROOM_ERROR", { code: "TRADE_FROZEN", message: "Trading is not available right now." });
    }
    if (room.stealState) {
      return socket.emit("ROOM_ERROR", { code: "TRADE_FROZEN", message: "A steal is in progress." });
    }
    const buyer = room.players.get(socket.id);
    if (!buyer) return;
    if (!canAfford(buyer, chipAmount)) {
      return socket.emit("ROOM_ERROR", { code: "INSUFFICIENT_CHIPS", message: "Not enough chips." });
    }
    if (!room.players.has(toSocketId)) {
      return socket.emit("ROOM_ERROR", { code: "PLAYER_NOT_FOUND", message: "Player not found." });
    }

    const offer = {
      offerId: uuidv4(),
      fromSocketId: socket.id,
      toSocketId,
      chipAmount,
      status: "pending",
      fragmentRevealed: null,
      createdAt: Date.now(),
    };
    room.tradeOffers.set(offer.offerId, offer);

    socket.emit("OFFER_SENT_ACK", { offerId: offer.offerId, status: "pending" });
    io.to(toSocketId).emit("OFFER_RECEIVED", {
      offerId: offer.offerId,
      fromPlayer: rm.publicPlayer(buyer),
      chipAmount,
    });
  });

  socket.on("ACCEPT_OFFER", ({ offerId }) => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room) return;

    const offer = room.tradeOffers.get(offerId);
    if (!offer || offer.status !== "pending" || offer.toSocketId !== socket.id) return;

    offer.status = "accepted";

    // Atomic chip transfer
    let chipUpdates;
    try {
      chipUpdates = transfer(room, offer.fromSocketId, offer.toSocketId, offer.chipAmount);
    } catch (err) {
      offer.status = "rejected";
      return socket.emit("ROOM_ERROR", { code: err.code || "TRADE_FAILED", message: err.message });
    }

    // Reveal seller's fragment to buyer only
    const seller = room.players.get(offer.toSocketId);
    offer.fragmentRevealed = seller?.fragment || null;

    // Track poison sold
    if (seller?.isPoison) seller.stats.poisonSold++;

    // Send result to buyer
    io.to(offer.fromSocketId).emit("OFFER_ACCEPTED", {
      offerId,
      fragment: offer.fragmentRevealed,
      chipDelta: -offer.chipAmount,
    });

    // Confirm to seller
    io.to(offer.toSocketId).emit("OFFER_ACCEPTED", {
      offerId,
      fragment: null, // seller already knows their fragment
      chipDelta: offer.chipAmount,
    });

    // Broadcast chip updates and activity
    for (const { socketId, chips } of chipUpdates) {
      io.to(room.code).emit("CHIPS_UPDATED", { socketId, chips });
    }

    const buyerName  = room.players.get(offer.fromSocketId)?.name || "?";
    const sellerName = room.players.get(offer.toSocketId)?.name   || "?";
    io.to(room.code).emit("TRADE_ACTIVITY", {
      text: `${buyerName} bought from ${sellerName}`,
      detail: `${offer.chipAmount} chip${offer.chipAmount !== 1 ? "s" : ""}`,
      timestamp: Date.now(),
    });
  });

  socket.on("REJECT_OFFER", ({ offerId }) => {
    const room = rm.getRoomBySocket(socket.id);
    if (!room) return;
    const offer = room.tradeOffers.get(offerId);
    if (!offer || offer.toSocketId !== socket.id) return;
    offer.status = "rejected";
    io.to(offer.fromSocketId).emit("OFFER_REJECTED", { offerId });
    socket.emit("OFFER_REJECTED", { offerId });
  });
}

/** Expire all pending offers (called on steal or phase end). */
function expirePendingOffers(io, room) {
  for (const [, offer] of room.tradeOffers) {
    if (offer.status === "pending") {
      offer.status = "expired";
      io.to(offer.fromSocketId).emit("OFFER_REJECTED", { offerId: offer.offerId, reason: "expired" });
    }
  }
}

module.exports = { registerTradeHandlers, expirePendingOffers };

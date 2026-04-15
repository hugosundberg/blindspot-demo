/**
 * Atomic chip operations.
 * All mutations are synchronous — no await between read and write.
 * After every call, emit CHIPS_UPDATED for affected players (caller's responsibility).
 */

function canAfford(player, amount) {
  return player.chips >= amount;
}

/** Transfer chips from buyer to seller. Throws if buyer can't afford it. */
function transfer(room, fromSocketId, toSocketId, amount) {
  const buyer  = room.players.get(fromSocketId);
  const seller = room.players.get(toSocketId);
  if (!buyer || !seller) throw Object.assign(new Error("Player not found"), { code: "PLAYER_NOT_FOUND" });
  if (!canAfford(buyer, amount)) throw Object.assign(new Error("Not enough chips"), { code: "INSUFFICIENT_CHIPS" });
  buyer.chips  -= amount;
  seller.chips += amount;
  return [
    { socketId: fromSocketId, chips: buyer.chips },
    { socketId: toSocketId,   chips: seller.chips },
  ];
}

function award(room, socketId, amount) {
  const p = room.players.get(socketId);
  if (!p) throw Object.assign(new Error("Player not found"), { code: "PLAYER_NOT_FOUND" });
  p.chips += amount;
  return [{ socketId, chips: p.chips }];
}

function deduct(room, socketId, amount) {
  const p = room.players.get(socketId);
  if (!p) throw Object.assign(new Error("Player not found"), { code: "PLAYER_NOT_FOUND" });
  p.chips -= amount;  // negative balance allowed
  return [{ socketId, chips: p.chips }];
}

/**
 * Resolve a steal outcome.
 * Returns array of { socketId, chips } for all affected players.
 */
function resolveSteal(room, stealerSocketId, correct) {
  const deltas = [];
  if (correct) {
    deltas.push(...award(room, stealerSocketId, 8));
    for (const [sid] of room.players) {
      if (sid !== stealerSocketId) {
        deltas.push(...deduct(room, sid, 1));
      }
    }
  } else {
    deltas.push(...deduct(room, stealerSocketId, 5));
  }
  return deltas;
}

/**
 * Resolve an answer outcome.
 * Returns array of { socketId, chips }.
 */
function resolveAnswer(room, socketId, correct) {
  if (correct === true)  return award(room, socketId, 5);
  if (correct === false) return deduct(room, socketId, 2);
  return []; // pass
}

module.exports = { canAfford, transfer, award, deduct, resolveSteal, resolveAnswer };

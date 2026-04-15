import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:4001";

let sharedSocket = null;

function getSocket() {
  if (!sharedSocket) {
    sharedSocket = io(SERVER_URL, { autoConnect: false });
  }
  return sharedSocket;
}

export function useSocket() {
  const socket = getSocket();
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onConnect    = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect",    onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect",    onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  const emit = useCallback((event, data) => {
    socket.emit(event, data);
  }, [socket]);

  const on = useCallback((event, handler) => {
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [socket]);

  return { socket, connected, emit, on };
}

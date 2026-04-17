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

export function resetSocket() {
  if (sharedSocket) {
    sharedSocket.disconnect();
    sharedSocket = null;
  }
}

export function useSocket() {
  const socket = getSocket();
  const [connected, setConnected] = useState(socket.connected);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onConnect      = () => { setConnected(true); setError(null); };
    const onDisconnect   = () => setConnected(false);
    const onConnectError = (err) => setError(err?.message || "Connection failed");
    const onError        = (err) => setError(err?.message || "Socket error");

    socket.on("connect",       onConnect);
    socket.on("disconnect",    onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("error",         onError);

    return () => {
      socket.off("connect",       onConnect);
      socket.off("disconnect",    onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("error",         onError);
    };
  }, [socket]);

  const emit = useCallback((event, data) => {
    socket.emit(event, data);
  }, [socket]);

  const on = useCallback((event, handler) => {
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, [socket]);

  return { socket, connected, error, emit, on };
}

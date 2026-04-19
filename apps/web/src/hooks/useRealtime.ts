"use client";

import { useEffect, useRef } from "react";
import { createBrowserClient } from "@/lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

type BroadcastEvent = {
  event: string;
  payload: Record<string, unknown>;
};

type Handler = (payload: Record<string, unknown>) => void;

export function useRealtime(
  roomCode: string | null,
  accessToken: string | null,
  handlers: Record<string, Handler>
) {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!roomCode || !accessToken) return;

    const supabase = createBrowserClient(accessToken);
    const channel = supabase.channel(`game:${roomCode}`, {
      config: { broadcast: { self: false } },
    });

    // Register all broadcast event handlers
    for (const [event, handler] of Object.entries(handlers)) {
      channel.on("broadcast", { event }, ({ payload }: BroadcastEvent) => handler(payload));
    }

    channel.subscribe();
    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
    // handlers object identity changes every render — intentionally excluded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, accessToken]);

  return channelRef;
}

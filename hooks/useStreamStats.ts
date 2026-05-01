import { useState, useEffect } from "react";
import { STREAM_STATS, StreamStats } from "@/constants/dummy";

export function useStreamStats(useDummy = true): StreamStats {
  const [stats, setStats] = useState<StreamStats>(STREAM_STATS);

  useEffect(() => {
    if (!useDummy) return;
    // Simulate small fluctuations every 5s
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        viewers: prev.viewers + Math.floor(Math.random() * 11) - 5,
        chatPerMin: Math.max(0, prev.chatPerMin + Math.floor(Math.random() * 7) - 3),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [useDummy]);

  return stats;
}

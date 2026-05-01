import { useState, useEffect, useRef } from "react";
import { CHAT_MESSAGES, INCOMING_MESSAGES, ChatMessage } from "@/constants/dummy";

export function useChatMessages(useDummy = true) {
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const incomingIndex = useRef(0);

  useEffect(() => {
    if (!useDummy) return;

    const interval = setInterval(() => {
      const next = INCOMING_MESSAGES[incomingIndex.current % INCOMING_MESSAGES.length];
      const newMsg: ChatMessage = {
        ...next,
        id: `live_${Date.now()}`,
        ts: Date.now(),
      };
      setMessages((prev) => [...prev.slice(-49), newMsg]);
      incomingIndex.current++;
    }, 3000);

    return () => clearInterval(interval);
  }, [useDummy]);

  return messages;
}

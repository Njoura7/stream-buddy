import { useState, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

const SESSION_ID = `session_${Date.now()}`;
const GROQ_MODEL = "llama-3.1-8b-instant";

const SYSTEM_PROMPT = `You are BuddyAI, the personal AI companion of njoura — a web dev streamer.
You're warm, calm, and direct. You speak like a knowledgeable friend, not a corporate chatbot.
Keep every response under 3 sentences unless asked for more.
You know njoura streams web dev content, uses Expo/React Native, and goes by the brand NJOURA <{Web.Dev}>.
When answering stream-related questions, be specific and practical.`;

export function useBuddyAI() {
  const [history, setHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const historyRef = useRef<Message[]>([]);

  const sendMessage = useCallback(async (userText: string): Promise<string> => {
    setIsLoading(true);
    setError(null);

    const newHistory: Message[] = [
      ...historyRef.current,
      { role: "user", content: userText },
    ];
    historyRef.current = newHistory;
    setHistory(newHistory);

    const key = process.env.EXPO_PUBLIC_GROQ_KEY;
    if (!key || key === "your_groq_api_key_here") {
      setIsLoading(false);
      return "Missing Groq key — paste your key into .env as EXPO_PUBLIC_GROQ_KEY.";
    }

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          max_tokens: 200,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...newHistory,
          ],
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        throw new Error(`${res.status}: ${body}`);
      }

      const data = await res.json();
      const reply: string = data.choices[0].message.content;

      const finalHistory: Message[] = [
        ...newHistory,
        { role: "assistant", content: reply },
      ];
      historyRef.current = finalHistory;
      setHistory(finalHistory);

      // Persist to Supabase — fire and forget
      supabase
        .from("buddy_conversations")
        .insert([
          { session_id: SESSION_ID, role: "user", content: userText },
          { session_id: SESSION_ID, role: "assistant", content: reply },
        ])
        .then(({ error: dbErr }) => {
          if (dbErr) console.warn("Supabase insert error:", dbErr.message);
        });

      return reply;
    } catch (e: any) {
      const msg = e.message ?? "Unknown error";
      console.error("BuddyAI error:", msg);
      setError(msg);
      return `Couldn't reach BuddyAI. (${msg})`;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** Transcribe audio via Groq Whisper (web only) */
  const transcribeAudio = useCallback(async (blob: Blob): Promise<string> => {
    const key = process.env.EXPO_PUBLIC_GROQ_KEY;
    if (!key || key === "your_groq_api_key_here") return "";

    const form = new FormData();
    form.append("file", blob, "audio.webm");
    form.append("model", "whisper-large-v3-turbo");
    form.append("language", "en");

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Whisper ${res.status}: ${body}`);
    }

    const data = await res.json();
    return (data.text ?? "").trim();
  }, []);

  const reset = useCallback(() => {
    historyRef.current = [];
    setHistory([]);
  }, []);

  return { history, isLoading, error, sendMessage, transcribeAudio, reset };
}

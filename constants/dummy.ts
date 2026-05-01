export interface StreamStats {
  viewers: number;
  chatPerMin: number;
  followersToday: number;
  totalSubs: number;
  peakViewers: number;
  uptime: string;
  isLive: boolean;
}

export interface ChatMessage {
  id: string;
  user: string;
  msg: string;
  color: string;
  badge?: string;
  ts: number;
}

export interface StreamAlert {
  id: string;
  type: "raid" | "sub" | "follow" | "donation" | "milestone";
  user: string;
  detail: string;
  ts: number;
}

export const STREAM_STATS: StreamStats = {
  viewers: 1247,
  chatPerMin: 43,
  followersToday: 28,
  totalSubs: 312,
  peakViewers: 1891,
  uptime: "02:14:33",
  isLive: true,
};

export const CHAT_MESSAGES: ChatMessage[] = [
  { id: "1", user: "neon_rider", msg: "this is fire bro 🔥", color: "#F59E0B", badge: "👑", ts: Date.now() - 5000 },
  { id: "2", user: "code_monk", msg: "what package manager are you using?", color: "#10B981", ts: Date.now() - 10000 },
  { id: "3", user: "darkwolf99", msg: "LUL LUL LUL", color: "#EF4444", badge: "⭐", ts: Date.now() - 15000 },
  { id: "4", user: "BuddyAI", msg: "📌 Topic: Expo Router — pin this?", color: "#60A5FA", badge: "🤖", ts: Date.now() - 20000 },
  { id: "5", user: "pixel_zero", msg: "bro this stack is insane", color: "#7C3AED", ts: Date.now() - 25000 },
  { id: "6", user: "stardust_77", msg: "can you show the file structure?", color: "#06B6D4", ts: Date.now() - 30000 },
  { id: "7", user: "xQc_fan", msg: "POGGERS POGGERS", color: "#F59E0B", badge: "🚀", ts: Date.now() - 35000 },
  { id: "8", user: "neon_gamer_xo", msg: "just followed, love the vibe", color: "#EC4899", ts: Date.now() - 40000 },
  { id: "9", user: "code_monk", msg: "this is exactly what I needed for my project", color: "#10B981", ts: Date.now() - 45000 },
  { id: "10", user: "lurker_99", msg: "been watching for an hour, finally chatting", color: "#6B7280", ts: Date.now() - 50000 },
  { id: "11", user: "neon_rider", msg: "when are you doing the backend?", color: "#F59E0B", badge: "👑", ts: Date.now() - 55000 },
  { id: "12", user: "dev_hunter", msg: "!commands", color: "#3B82F6", ts: Date.now() - 60000 },
  { id: "13", user: "BuddyAI", msg: "🔥 Chat is 87% positive today!", color: "#60A5FA", badge: "🤖", ts: Date.now() - 65000 },
  { id: "14", user: "alpha_stream", msg: "the 3D orb is sick", color: "#7C3AED", ts: Date.now() - 70000 },
  { id: "15", user: "darkwolf99", msg: "raid incoming from CodeWithMe!", color: "#EF4444", badge: "⭐", ts: Date.now() - 75000 },
  { id: "16", user: "circuit_breaker", msg: "expo router is the way to go fr", color: "#06B6D4", ts: Date.now() - 80000 },
  { id: "17", user: "njoura_fan", msg: "HYPEE lets gooo", color: "#F59E0B", ts: Date.now() - 85000 },
  { id: "18", user: "pixel_zero", msg: "can we get a tutorial on the NativeWind setup?", color: "#7C3AED", ts: Date.now() - 90000 },
  { id: "19", user: "stardust_77", msg: "sub incoming for this content 💯", color: "#06B6D4", ts: Date.now() - 95000 },
  { id: "20", user: "code_monk", msg: "GG stream, learned so much", color: "#10B981", ts: Date.now() - 100000 },
];

export const INCOMING_MESSAGES: ChatMessage[] = [
  { id: "i1", user: "new_viewer_42", msg: "just found your channel, this is quality content", color: "#3B82F6", ts: 0 },
  { id: "i2", user: "neon_rider", msg: "drop the github link!", color: "#F59E0B", badge: "👑", ts: 0 },
  { id: "i3", user: "BuddyAI", msg: "💡 Tip: Your viewer retention is up 12% today", color: "#60A5FA", badge: "🤖", ts: 0 },
  { id: "i4", user: "alpha_stream", msg: "this NativeWind setup is clean AF", color: "#7C3AED", ts: 0 },
  { id: "i5", user: "darkwolf99", msg: "PogChamp PogChamp PogChamp", color: "#EF4444", badge: "⭐", ts: 0 },
  { id: "i6", user: "lurker_99", msg: "w streamer fr", color: "#6B7280", ts: 0 },
];

export const ALERTS: StreamAlert[] = [
  { id: "1", type: "raid", user: "xQc_fan", detail: "80 viewers", ts: Date.now() - 120000 },
  { id: "2", type: "sub", user: "darkwolf99", detail: "1 month", ts: Date.now() - 300000 },
  { id: "3", type: "follow", user: "neon_gamer_xo", detail: "", ts: Date.now() - 420000 },
  { id: "4", type: "donation", user: "code_monk", detail: "$5.00 — keep it up!", ts: Date.now() - 720000 },
  { id: "5", type: "milestone", user: "Stream", detail: "1,200 viewers reached!", ts: Date.now() - 900000 },
  { id: "6", type: "sub", user: "pixel_zero", detail: "3 months", ts: Date.now() - 1200000 },
  { id: "7", type: "follow", user: "alpha_stream", detail: "", ts: Date.now() - 1500000 },
  { id: "8", type: "donation", user: "stardust_77", detail: "$20.00 — amazing stream!", ts: Date.now() - 1800000 },
];

export const AI_SUGGESTIONS = [
  "Your chat is heating up! Consider a hype poll.",
  "Raider from xQc_fan brought 80 viewers — shoutout opportunity!",
  "You've been live 2h — great time for a hydration break reminder.",
  "Engagement is up 34% — this is a great time to announce your next stream.",
  "3 first-time chatters in the last 5 mins — welcome them!",
];

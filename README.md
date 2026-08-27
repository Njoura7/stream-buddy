# StreamBuddy

An AI-powered companion app for livestreamers, built with Expo + React Native. StreamBuddy gives a streamer a single mobile/web dashboard for stream stats, live chat, event alerts, and a voice-and-text AI co-host ("BuddyAI") that can listen, think, and talk back mid-stream.

> Status: active proof-of-concept. The dashboard, chat feed, and alerts currently run on mock/simulated data (see [Current data sources](#current-data-sources) below); BuddyAI's voice/text assistant is fully wired up to live APIs.

## Features

- **Dashboard** — live-style viewer/chat/follower/sub stats, an animated 3D-style orb hero, and rotating AI-generated stream suggestions (polls, shoutouts).
- **BuddyAI (voice + text)** — hold-to-talk mic input, speech-to-text via Groq Whisper, a chat reply from a Groq-hosted LLM, and a spoken response via on-device text-to-speech. Works on native (Expo `expo-av` recording) and web (`MediaRecorder`).
- **Stream Chat** — a live chat feed with an AI side panel showing detected topic, sentiment score, toxic-message filtering status, and suggested replies.
- **Alerts** — a feed of stream events (raids, subs, follows, donations, milestones) with an AI-generated session summary.
- **Settings** — BuddyAI configuration (suggestions, toxic filter, sensitivity), avatar picker, stream key placeholder, and backend connection status.

## Tech stack

- [Expo](https://expo.dev) 54 / React Native 0.81 / [Expo Router](https://docs.expo.dev/router/introduction/) (file-based navigation)
- TypeScript
- [NativeWind](https://www.nativewind.dev/) / Tailwind CSS for styling, plus `StyleSheet` for animated screens
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) for motion/animation
- [Supabase](https://supabase.com) (`@supabase/supabase-js`) for auth/storage and BuddyAI conversation persistence
- [Groq API](https://console.groq.com) — `llama-3.1-8b-instant` for chat, `whisper-large-v3-turbo` for speech-to-text
- `expo-speech` for text-to-speech

## Getting started

### Prerequisites

- Node.js 18+
- npm
- The [Expo Go](https://expo.dev/go) app (for testing on a physical device) or an iOS/Android simulator
- A [Groq](https://console.groq.com) API key
- A [Supabase](https://supabase.com) project URL + anon key

### Install

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root (already git-ignored):

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_GROQ_KEY=your_groq_api_key
```

- `EXPO_PUBLIC_GROQ_KEY` powers BuddyAI's chat replies and speech transcription. Without it, the app runs but BuddyAI responds with a "missing key" message.
- `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` are required for the Supabase client to initialize. BuddyAI conversations are persisted to a `buddy_conversations` table (`session_id`, `role`, `content` columns) — create this table in your Supabase project if you want conversation history saved.

### Run

```bash
npm run start    # Expo dev server — scan the QR code with Expo Go
npm run ios      # iOS simulator
npm run android  # Android emulator
npm run web      # Web browser
```

## Project structure

```
app/                     # Expo Router screens
  (tabs)/
    index.tsx             # Dashboard
    chat.tsx               # Stream chat + AI panel
    buddy.tsx               # BuddyAI voice/text assistant
    alerts.tsx               # Stream event alerts
    settings.tsx               # App & BuddyAI settings
components/
  3d/OrbCanvas.tsx          # Animated hero orb
  audio/WaveformVisualizer.tsx
  avatar/BuddyAvatar.tsx
  ui/                         # Shared UI (GlassPanel, StatCard, ChatBubble, ...)
hooks/
  useBuddyAI.ts             # Groq chat + Whisper transcription + Supabase persistence
  useChatMessages.ts          # Simulated live chat feed
  useStreamStats.ts             # Simulated stream stats
lib/supabase.ts             # Supabase client
constants/
  theme.ts                    # Colors, spacing, radius
  dummy.ts                      # Mock stats/chat/alerts data
```

## Current data sources

Dashboard stats, the chat feed, and alerts are currently powered by mock data in `constants/dummy.ts`, refreshed on a timer inside `useStreamStats` and `useChatMessages` to simulate a live stream. Swapping these for a real integration (e.g. Twitch/YouTube APIs) means replacing the bodies of those two hooks — the screens themselves already consume the hooks' return values, so no UI changes should be needed.

BuddyAI (the `buddy` tab) is the one feature already talking to live services end to end: mic input → Groq Whisper transcription → Groq chat completion → `expo-speech` playback, with the exchange persisted to Supabase.

## License

No license specified yet.

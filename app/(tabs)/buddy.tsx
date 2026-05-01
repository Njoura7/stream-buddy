import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View, Text, StyleSheet, Pressable, TextInput,
  ScrollView, Platform, KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import * as Haptics from "expo-haptics";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { WaveformVisualizer } from "@/components/audio/WaveformVisualizer";
import { useBuddyAI } from "@/hooks/useBuddyAI";
import { Colors } from "@/constants/theme";

type Status = "idle" | "recording" | "thinking" | "speaking";

async function getMaleVoice(): Promise<string | undefined> {
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    const preferred = ["Aaron", "Alex", "Daniel", "Oliver", "Luca", "Niko", "Tom"];
    const en = voices.filter((v) => v.language?.startsWith("en"));
    const match = en.find((v) => preferred.some((n) => v.name?.includes(n)));
    return match?.identifier;
  } catch {
    return undefined;
  }
}

function StatusPill({ status }: { status: Status }) {
  const labels: Record<Status, string> = {
    idle: "Ready",
    recording: "Listening...",
    thinking: "Thinking...",
    speaking: "Speaking...",
  };
  const colors: Record<Status, string> = {
    idle: Colors.textMuted,
    recording: Colors.cyan,
    thinking: Colors.accent,
    speaking: "#10B981",
  };
  return (
    <View style={[styles.statusPill, { borderColor: colors[status] }]}>
      <View style={[styles.statusDot, { backgroundColor: colors[status] }]} />
      <Text style={[styles.statusText, { color: colors[status] }]}>
        {labels[status]}
      </Text>
    </View>
  );
}

export default function BuddyScreen() {
  const [status, setStatus] = useState<Status>("idle");
  const [micLevel, setMicLevel] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [inputText, setInputText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Native recording (Expo Go)
  const recordingRef = useRef<Audio.Recording | null>(null);
  // Web recording (MediaRecorder + Groq Whisper)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const statusRef = useRef<Status>("idle");
  const { sendMessage, transcribeAudio } = useBuddyAI();
  const sendRef = useRef(sendMessage);
  const transcribeRef = useRef(transcribeAudio);
  useEffect(() => { sendRef.current = sendMessage; }, [sendMessage]);
  useEffect(() => { transcribeRef.current = transcribeAudio; }, [transcribeAudio]);

  useEffect(() => {
    if (Platform.OS !== "web") Audio.requestPermissionsAsync();
  }, []);

  const setStatusSync = (s: Status) => {
    statusRef.current = s;
    setStatus(s);
  };

  const speak = useCallback(async (text: string) => {
    setStatusSync("speaking");
    Speech.stop();
    const voice = await getMaleVoice();
    await new Promise<void>((resolve) => {
      Speech.speak(text, {
        language: "en-US",
        pitch: 0.88,
        rate: 0.9,
        voice,
        onDone: resolve,
        onError: resolve,
        onStopped: resolve,
      });
    });
    setStatusSync("idle");
  }, []);

  const processText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setTranscript(text);
    setReply("");
    setErrorMsg("");
    setStatusSync("thinking");
    const response = await sendRef.current(text);
    if (response.startsWith("Couldn't") || response.startsWith("Missing")) {
      setErrorMsg(response);
      setStatusSync("idle");
    } else {
      setReply(response);
      await speak(response);
    }
  }, [speak]);

  // ─── Native recording (Expo Go — no free STT, user types) ───────────────
  const startNativeRecording = useCallback(async () => {
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        isMeteringEnabled: true,
      });
      rec.setOnRecordingStatusUpdate((s) => {
        if (s.isRecording && s.metering != null) {
          setMicLevel(Math.max(0, (s.metering + 60) / 60));
        }
      });
      await rec.startAsync();
      recordingRef.current = rec;
      setStatusSync("recording");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (e) {
      console.warn("Recording error:", e);
    }
  }, []);

  const stopNativeRecording = useCallback(async () => {
    setMicLevel(0);
    if (!recordingRef.current) return;
    try { await recordingRef.current.stopAndUnloadAsync(); } catch {}
    recordingRef.current = null;
    setStatusSync("idle");
  }, []);

  // ─── Web recording: MediaRecorder → Groq Whisper STT ───────────────────
  const startWebRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";
      const mr = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mr.start(100); // collect chunks every 100ms for live level simulation
      mediaRecorderRef.current = mr;
      setErrorMsg("");
      setStatusSync("recording");
    } catch {
      setErrorMsg("Microphone access denied. Enable it in browser settings.");
    }
  }, []);

  const stopWebRecording = useCallback(async () => {
    const mr = mediaRecorderRef.current;
    if (!mr) return;

    await new Promise<void>((resolve) => {
      mr.onstop = () => resolve();
      mr.stop();
      mr.stream.getTracks().forEach((t) => t.stop());
    });
    mediaRecorderRef.current = null;
    setMicLevel(0);

    const chunks = audioChunksRef.current;
    audioChunksRef.current = [];

    if (chunks.length === 0) {
      setStatusSync("idle");
      return;
    }

    const mimeType = chunks[0].type || "audio/webm";
    const blob = new Blob(chunks, { type: mimeType });

    if (blob.size < 2000) {
      // Too short — likely no speech
      setStatusSync("idle");
      return;
    }

    setStatusSync("thinking");
    try {
      const text = await transcribeRef.current(blob);
      if (text) {
        processText(text);
      } else {
        setErrorMsg("No speech detected. Try holding the mic longer.");
        setStatusSync("idle");
      }
    } catch (e: any) {
      setErrorMsg(`Transcription failed: ${e.message}`);
      setStatusSync("idle");
    }
  }, [processText]);

  // Simulate mic level on web (MediaRecorder doesn't expose metering)
  useEffect(() => {
    if (status !== "recording" || Platform.OS !== "web") return;
    const iv = setInterval(() => {
      setMicLevel(0.3 + Math.random() * 0.7);
    }, 120);
    return () => clearInterval(iv);
  }, [status]);

  const handleMicPress = useCallback(() => {
    if (statusRef.current !== "idle") return;
    if (Platform.OS === "web") {
      void startWebRecording();
    } else {
      void startNativeRecording();
    }
  }, [startWebRecording, startNativeRecording]);

  const handleMicRelease = useCallback(() => {
    if (statusRef.current !== "recording") return;
    if (Platform.OS === "web") {
      void stopWebRecording();
    } else {
      void stopNativeRecording();
    }
  }, [stopWebRecording, stopNativeRecording]);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");
    processText(text);
  }, [inputText, processText]);

  const micIcon = status === "recording" ? "⏹"
    : status === "thinking" ? "⏳"
    : status === "speaking" ? "🔊"
    : "🎙";

  return (
    <LinearGradient colors={[Colors.background, "#0D0E1F", Colors.background]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

            <Animated.View entering={FadeInDown.delay(0)} style={styles.header}>
              <Text style={styles.title}>BUDDY AI</Text>
              <Text style={styles.subtitle}>Voice · Text · Memory</Text>
            </Animated.View>

            {/* Waveform + status */}
            <Animated.View entering={FadeInDown.delay(60)}>
              <GlassPanel style={styles.vizCard}>
                <WaveformVisualizer
                  level={micLevel}
                  isActive={status === "recording" || status === "speaking"}
                />
                <View style={styles.statusRow}>
                  <StatusPill status={status} />
                </View>
              </GlassPanel>
            </Animated.View>

            {/* Mic button */}
            <Animated.View entering={FadeInDown.delay(120)} style={styles.micRow}>
              <Pressable
                onPressIn={handleMicPress}
                onPressOut={handleMicRelease}
                disabled={status === "thinking" || status === "speaking"}
                style={({ pressed }) => [
                  styles.micBtn,
                  status === "recording" && styles.micBtnActive,
                  (status === "thinking" || status === "speaking") && styles.micBtnDisabled,
                  pressed && styles.micBtnPressed,
                ]}
              >
                <Text style={styles.micIcon}>{micIcon}</Text>
              </Pressable>
              <Text style={styles.micHint}>
                {Platform.OS === "web"
                  ? "Hold mic → speak → release → Buddy answers"
                  : "Type below or hold mic to record"}
              </Text>
            </Animated.View>

            {/* Error */}
            {errorMsg ? (
              <Animated.View entering={FadeInUp.springify()} style={styles.errorCard}>
                <Text style={styles.errorText}>⚠ {errorMsg}</Text>
              </Animated.View>
            ) : null}

            {/* Transcript */}
            {transcript ? (
              <Animated.View entering={FadeInUp.springify()} style={{ marginBottom: 12 }}>
                <GlassPanel>
                  <Text style={styles.bubbleLabel}>YOU</Text>
                  <Text style={styles.bubbleText}>{transcript}</Text>
                </GlassPanel>
              </Animated.View>
            ) : null}

            {/* AI reply */}
            {reply ? (
              <Animated.View entering={FadeInUp.delay(80).springify()} style={{ marginBottom: 12 }}>
                <GlassPanel style={styles.replyCard}>
                  <Text style={[styles.bubbleLabel, { color: Colors.cyan }]}>BUDDY AI</Text>
                  <Text style={[styles.bubbleText, { color: Colors.glow }]}>{reply}</Text>
                </GlassPanel>
              </Animated.View>
            ) : null}

            {/* Text input */}
            <Animated.View entering={FadeInDown.delay(200)} style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask Buddy anything…"
                placeholderTextColor={Colors.textMuted}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
                returnKeyType="send"
                editable={status === "idle"}
                multiline={false}
              />
              <Pressable
                onPress={handleSend}
                disabled={!inputText.trim() || status !== "idle"}
                style={({ pressed }) => [
                  styles.sendBtn,
                  pressed && { opacity: 0.7 },
                  (!inputText.trim() || status !== "idle") && { opacity: 0.35 },
                ]}
              >
                <Text style={styles.sendIcon}>➤</Text>
              </Pressable>
            </Animated.View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 120 },
  header: { paddingTop: 8, paddingBottom: 20, alignItems: "center" },
  title: { fontSize: 18, fontFamily: "Orbitron_700Bold", color: Colors.textPrimary, letterSpacing: 3 },
  subtitle: { fontSize: 11, color: Colors.textMuted, fontFamily: "JetBrainsMono_400Regular", marginTop: 4 },
  vizCard: { alignItems: "center", paddingVertical: 24, marginBottom: 24 },
  statusRow: { marginTop: 16 },
  statusPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 5,
  },
  statusDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontSize: 12, fontFamily: "JetBrainsMono_400Regular", letterSpacing: 0.5 },
  micRow: { alignItems: "center", marginBottom: 28 },
  micBtn: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderWidth: 2, borderColor: Colors.accent,
    alignItems: "center", justifyContent: "center",
    shadowColor: Colors.accent, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 16, elevation: 8,
  },
  micBtnActive: {
    backgroundColor: "rgba(6, 182, 212, 0.25)",
    borderColor: Colors.cyan,
    shadowColor: Colors.cyan, shadowOpacity: 1, shadowRadius: 24,
  },
  micBtnDisabled: { opacity: 0.35 },
  micBtnPressed: { transform: [{ scale: 0.93 }] },
  micIcon: { fontSize: 32 },
  micHint: { marginTop: 10, fontSize: 11, color: Colors.textMuted, fontFamily: "JetBrainsMono_400Regular", textAlign: "center" },
  errorCard: {
    backgroundColor: "rgba(239, 68, 68, 0.1)", borderRadius: 10,
    borderWidth: 1, borderColor: "rgba(239, 68, 68, 0.3)",
    padding: 12, marginBottom: 12,
  },
  errorText: { color: Colors.error, fontSize: 12, fontFamily: "JetBrainsMono_400Regular" },
  bubbleLabel: { fontSize: 9, color: Colors.textMuted, fontFamily: "JetBrainsMono_400Regular", letterSpacing: 1.5, marginBottom: 5 },
  bubbleText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 21 },
  replyCard: { borderColor: "rgba(6, 182, 212, 0.3)" },
  inputRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  textInput: {
    flex: 1, height: 46, backgroundColor: Colors.surface2,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, color: Colors.textPrimary,
    fontFamily: "JetBrainsMono_400Regular", fontSize: 13,
  },
  sendBtn: {
    width: 46, height: 46, borderRadius: 12,
    backgroundColor: Colors.accent, alignItems: "center", justifyContent: "center",
  },
  sendIcon: { color: "#fff", fontSize: 16 },
});

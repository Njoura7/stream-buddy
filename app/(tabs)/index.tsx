import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatCard } from "@/components/ui/StatCard";
import { AlertBadge } from "@/components/ui/AlertBadge";
import { OrbCanvas, OrbFallback } from "@/components/3d/OrbCanvas";
import { Colors } from "@/constants/theme";
import { useStreamStats } from "@/hooks/useStreamStats";
import { ALERTS, AI_SUGGESTIONS } from "@/constants/dummy";

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const stats = useStreamStats();
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  const currentSuggestion = AI_SUGGESTIONS[suggestionIndex % AI_SUGGESTIONS.length];
  const recentAlerts = ALERTS.slice(0, 3);

  return (
    <LinearGradient
      colors={[Colors.background, "#0D0E1F", Colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.content,
            { paddingBottom: 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(0)} style={styles.header}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.liveIndicator}>
              <Animated.View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </Animated.View>

          {/* 3D Orb Hero */}
          <Animated.View entering={FadeInDown.delay(80)} style={styles.orbContainer}>
            <OrbCanvas height={220} showParticles />
          </Animated.View>

          {/* Uptime */}
          <Animated.View entering={FadeInDown.delay(120)} style={styles.uptime}>
            <Text style={styles.uptimeText}>⏱ {stats.uptime}</Text>
          </Animated.View>

          {/* Stat Cards */}
          <Animated.View entering={FadeInDown.delay(160)}>
            <Text style={styles.sectionTitle}>STREAM STATS</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.statsScroll}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              <StatCard icon="👁" label="Viewers" value={stats.viewers} color={Colors.cyan} />
              <StatCard icon="💬" label="Chat/min" value={stats.chatPerMin} color={Colors.accent} />
              <StatCard icon="❤️" label="Followers" value={stats.followersToday} prefix="+" color="#EC4899" />
              <StatCard icon="⭐" label="Subs" value={stats.totalSubs} color={Colors.warning} />
              <StatCard icon="📈" label="Peak" value={stats.peakViewers} color={Colors.glow} />
            </ScrollView>
          </Animated.View>

          {/* BuddyAI Suggestion */}
          <Animated.View entering={FadeInDown.delay(220)}>
            <Text style={styles.sectionTitle}>BUDDY AI</Text>
            <GlassPanel style={styles.aiCard}>
              <View style={styles.aiHeader}>
                <Text style={styles.aiIcon}>🤖</Text>
                <Text style={styles.aiTitle}>BuddyAI says:</Text>
              </View>
              <Text style={styles.aiText}>{currentSuggestion}</Text>
              <View style={styles.aiActions}>
                <Pressable
                  style={({ pressed }) => [styles.aiBtn, pressed && styles.aiBtnPressed]}
                  onPress={() => setSuggestionIndex((i) => i + 1)}
                >
                  <Text style={styles.aiBtnText}>Quick Poll</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.aiBtn, pressed && styles.aiBtnPressed]}
                  onPress={() => {}}
                >
                  <Text style={styles.aiBtnText}>Shoutout</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.aiBtnGhost, pressed && styles.aiBtnPressed]}
                  onPress={() => setSuggestionIndex((i) => i + 1)}
                >
                  <Text style={styles.aiBtnGhostText}>Skip</Text>
                </Pressable>
              </View>
            </GlassPanel>
          </Animated.View>

          {/* Recent Alerts */}
          <Animated.View entering={FadeInDown.delay(280)}>
            <Text style={styles.sectionTitle}>RECENT ALERTS</Text>
            {recentAlerts.map((alert, i) => (
              <AlertBadge key={alert.id} alert={alert} index={i} />
            ))}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 12,
  },
  logoImage: {
    height: 48,
    width: 120,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.4)",
    gap: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "#EF4444",
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  liveText: {
    color: "#EF4444",
    fontSize: 11,
    fontFamily: "JetBrainsMono_400Regular",
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  orbContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  uptime: {
    alignItems: "center",
    marginBottom: 20,
  },
  uptimeText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 4,
  },
  statsScroll: {
    marginBottom: 20,
  },
  aiCard: {
    marginBottom: 20,
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  aiIcon: {
    fontSize: 18,
  },
  aiTitle: {
    fontSize: 13,
    color: Colors.glow,
    fontFamily: "JetBrainsMono_400Regular",
    fontWeight: "700",
  },
  aiText: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 21,
    marginBottom: 14,
  },
  aiActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  aiBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  aiBtnPressed: {
    opacity: 0.7,
  },
  aiBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "JetBrainsMono_400Regular",
  },
  aiBtnGhost: {
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  aiBtnGhostText: {
    color: Colors.textMuted,
    fontSize: 12,
    fontFamily: "JetBrainsMono_400Regular",
  },
  warning: {
    color: Colors.warning,
  },
});

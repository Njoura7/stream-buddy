import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AlertBadge } from "@/components/ui/AlertBadge";
import { Colors } from "@/constants/theme";
import { ALERTS } from "@/constants/dummy";

export default function AlertsScreen() {
  return (
    <LinearGradient
      colors={[Colors.background, "#0D0E1F", Colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(0)} style={styles.header}>
            <Text style={styles.headerTitle}>ALERTS</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{ALERTS.length}</Text>
            </View>
          </Animated.View>

          {/* Summary card */}
          <Animated.View entering={FadeInDown.delay(60)}>
            <GlassPanel style={styles.summaryCard}>
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryIcon}>🤖</Text>
                <Text style={styles.summaryTitle}>BuddyAI Alert Summary</Text>
              </View>
              <Text style={styles.summaryText}>
                Great session so far! 3 raids received, 12 new subs, engagement up 34% vs last stream.
              </Text>
              <View style={styles.summaryStats}>
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryStatValue, { color: Colors.accent }]}>3</Text>
                  <Text style={styles.summaryStatLabel}>Raids</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryStatValue, { color: Colors.warning }]}>12</Text>
                  <Text style={styles.summaryStatLabel}>Subs</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStat}>
                  <Text style={[styles.summaryStatValue, { color: "#10B981" }]}>+34%</Text>
                  <Text style={styles.summaryStatLabel}>Engagement</Text>
                </View>
              </View>
            </GlassPanel>
          </Animated.View>

          {/* Alert feed */}
          <Animated.View entering={FadeInDown.delay(120)}>
            <Text style={styles.sectionTitle}>ALL ALERTS</Text>
            {ALERTS.map((alert, i) => (
              <AlertBadge key={alert.id} alert={alert} index={i} />
            ))}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 16,
    gap: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Orbitron_700Bold",
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  badge: {
    backgroundColor: Colors.error,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  summaryCard: {
    marginBottom: 20,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  summaryIcon: {
    fontSize: 18,
  },
  summaryTitle: {
    fontSize: 13,
    color: Colors.glow,
    fontFamily: "JetBrainsMono_400Regular",
    fontWeight: "700",
  },
  summaryText: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: 14,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  summaryStat: {
    alignItems: "center",
  },
  summaryStatValue: {
    fontSize: 22,
    fontFamily: "JetBrainsMono_400Regular",
    fontWeight: "700",
    marginBottom: 2,
  },
  summaryStatLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 10,
  },
});

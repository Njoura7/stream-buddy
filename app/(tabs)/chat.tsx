import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { BuddyAvatar } from "@/components/avatar/BuddyAvatar";
import { Colors } from "@/constants/theme";
import { useChatMessages } from "@/hooks/useChatMessages";
import { ChatMessage } from "@/constants/dummy";

export default function ChatScreen() {
  const { width } = useWindowDimensions();
  const messages = useChatMessages();
  const flatListRef = useRef<FlatList>(null);
  const isWide = width >= 768;

  const pinnedMessage = messages.find((m) => m.user === "BuddyAI");

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => (
    <ChatBubble message={item} index={index} />
  );

  const aiPanel = (
    <Animated.View entering={FadeInDown.delay(100)} style={[styles.aiPanel, isWide && styles.aiPanelWide]}>
      <GlassPanel style={styles.aiPanelInner}>
        <View style={styles.aiPanelHeader}>
          <BuddyAvatar size={40} variant={0} />
          <View style={styles.aiPanelTitle}>
            <Text style={styles.aiName}>BuddyAI</Text>
            <Text style={styles.aiStatus}>● Active</Text>
          </View>
        </View>

        <View style={styles.aiSection}>
          <Text style={styles.aiSectionLabel}>TOPIC DETECTED</Text>
          <Text style={styles.aiSectionValue}>⚡ React Native tutorial</Text>
        </View>

        <View style={styles.aiSection}>
          <Text style={styles.aiSectionLabel}>SENTIMENT</Text>
          <View style={styles.sentimentBar}>
            <View style={[styles.sentimentFill, { width: "87%" }]} />
          </View>
          <Text style={styles.sentimentText}>😊 Positive · 87%</Text>
        </View>

        <View style={styles.aiSection}>
          <Text style={styles.aiSectionLabel}>FILTER</Text>
          <View style={styles.filterRow}>
            <View style={styles.filterDot} />
            <Text style={styles.filterText}>Toxic filter ON</Text>
          </View>
        </View>

        <View style={styles.aiSection}>
          <Text style={styles.aiSectionLabel}>SUGGESTED REPLIES</Text>
          {["Thanks for watching!", "Check the GitHub link!", "Coming up next..."].map((s) => (
            <View key={s} style={styles.suggestionChip}>
              <Text style={styles.suggestionText}>{s}</Text>
            </View>
          ))}
        </View>
      </GlassPanel>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={[Colors.background, "#0D0E1F", Colors.background]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={["top"]}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0)} style={styles.header}>
          <Text style={styles.headerTitle}>STREAM CHAT</Text>
          <View style={styles.headerRight}>
            <Text style={styles.messageCount}>{messages.length} msgs</Text>
          </View>
        </Animated.View>

        <View style={[styles.body, isWide && styles.bodyWide]}>
          {/* Chat Feed */}
          <View style={[styles.chatFeed, isWide && styles.chatFeedWide]}>
            {/* Pinned message */}
            {pinnedMessage && (
              <View style={styles.pinnedContainer}>
                <Text style={styles.pinnedLabel}>📌 PINNED</Text>
                <Text style={styles.pinnedText}>{pinnedMessage.msg}</Text>
              </View>
            )}

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
              style={styles.flatList}
              contentContainerStyle={{ paddingBottom: isWide ? 20 : 100 }}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* AI Sidebar (wide) or bottom sheet placeholder (mobile) */}
          {isWide ? aiPanel : null}
        </View>

        {/* Mobile AI panel at bottom */}
        {!isWide && (
          <Animated.View entering={FadeInDown.delay(100)} style={styles.mobileAiBar}>
            <GlassPanel style={styles.mobileAiInner}>
              <View style={styles.mobileAiRow}>
                <BuddyAvatar size={32} variant={0} animate={false} />
                <View style={styles.mobileAiContent}>
                  <Text style={styles.mobileAiText}>😊 87% positive · Topic: React Native</Text>
                </View>
                <View style={styles.filterDot} />
              </View>
            </GlassPanel>
          </Animated.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Orbitron_700Bold",
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  headerRight: {},
  messageCount: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
  },
  body: {
    flex: 1,
  },
  bodyWide: {
    flexDirection: "row",
  },
  chatFeed: {
    flex: 1,
  },
  chatFeedWide: {
    flex: 0.7,
  },
  pinnedContainer: {
    marginHorizontal: 12,
    marginBottom: 8,
    padding: 10,
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.3)",
  },
  pinnedLabel: {
    fontSize: 10,
    color: Colors.glow,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 1,
    marginBottom: 3,
  },
  pinnedText: {
    fontSize: 13,
    color: Colors.glow,
  },
  flatList: {
    flex: 1,
  },
  aiPanel: {
    padding: 12,
  },
  aiPanelWide: {
    flex: 0.3,
  },
  aiPanelInner: {
    flex: 1,
  },
  aiPanelHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  aiPanelTitle: {},
  aiName: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontFamily: "JetBrainsMono_400Regular",
    fontWeight: "700",
  },
  aiStatus: {
    fontSize: 11,
    color: "#10B981",
    fontFamily: "JetBrainsMono_400Regular",
  },
  aiSection: {
    marginBottom: 14,
  },
  aiSectionLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  aiSectionValue: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: "JetBrainsMono_400Regular",
  },
  sentimentBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    marginBottom: 5,
    overflow: "hidden",
  },
  sentimentFill: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 2,
  },
  sentimentText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
  },
  filterText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontFamily: "JetBrainsMono_400Regular",
  },
  suggestionChip: {
    backgroundColor: "rgba(59, 130, 246, 0.12)",
    borderRadius: 6,
    padding: 7,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  suggestionText: {
    fontSize: 12,
    color: Colors.glow,
    fontFamily: "JetBrainsMono_400Regular",
  },
  mobileAiBar: {
    position: "absolute",
    bottom: 80,
    left: 12,
    right: 12,
  },
  mobileAiInner: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  mobileAiRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mobileAiContent: {
    flex: 1,
  },
  mobileAiText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
  },
});

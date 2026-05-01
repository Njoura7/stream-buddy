import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors } from "@/constants/theme";
import { ChatMessage } from "@/constants/dummy";

interface ChatBubbleProps {
  message: ChatMessage;
  index?: number;
}

export function ChatBubble({ message, index = 0 }: ChatBubbleProps) {
  const isAI = message.user === "BuddyAI";

  return (
    <Animated.View
      entering={FadeInUp.delay(Math.min(index * 40, 400)).springify()}
      style={[styles.container, isAI && styles.aiContainer]}
    >
      <View style={styles.header}>
        {message.badge ? (
          <Text style={styles.badge}>{message.badge}</Text>
        ) : null}
        <Text style={[styles.username, { color: message.color }]}>
          {message.user}
        </Text>
        {isAI && (
          <View style={styles.aiTag}>
            <Text style={styles.aiTagText}>AI</Text>
          </View>
        )}
      </View>
      <Text style={[styles.message, isAI && styles.aiMessage]}>
        {message.msg}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(59, 130, 246, 0.08)",
  },
  aiContainer: {
    backgroundColor: "rgba(59, 130, 246, 0.08)",
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.2)",
    borderBottomColor: "rgba(59, 130, 246, 0.2)",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 4,
  },
  badge: {
    fontSize: 12,
  },
  username: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "JetBrainsMono_400Regular",
  },
  aiTag: {
    backgroundColor: Colors.accent,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  aiTagText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 14,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  aiMessage: {
    color: Colors.glow,
  },
});

import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeInRight,
} from "react-native-reanimated";
import { Colors, AlertColors, AlertIcons } from "@/constants/theme";
import { StreamAlert } from "@/constants/dummy";

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

interface AlertBadgeProps {
  alert: StreamAlert;
  index?: number;
}

export function AlertBadge({ alert, index = 0 }: AlertBadgeProps) {
  const borderColor = AlertColors[alert.type] ?? Colors.accent;
  const icon = AlertIcons[alert.type] ?? "📢";

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 80).springify()}
      style={[styles.card, { borderLeftColor: borderColor }]}
    >
      <Text style={styles.icon}>{icon}</Text>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[styles.type, { color: borderColor }]}>
            {alert.type.toUpperCase()}
          </Text>
          <Text style={styles.time}>{timeAgo(alert.ts)}</Text>
        </View>
        <Text style={styles.user}>{alert.user}</Text>
        {alert.detail ? (
          <Text style={styles.detail}>{alert.detail}</Text>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 17, 35, 0.92)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    padding: 14,
    marginBottom: 10,
  },
  icon: {
    fontSize: 22,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  type: {
    fontSize: 10,
    fontFamily: "JetBrainsMono_400Regular",
    fontWeight: "700",
    letterSpacing: 1,
  },
  time: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
  },
  user: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  detail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
});

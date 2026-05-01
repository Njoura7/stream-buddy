import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { GlassPanel } from "./GlassPanel";
import { Colors } from "@/constants/theme";

interface StatCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: string;
  color?: string;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

export function StatCard({ label, value, prefix = "", suffix = "", icon, color = Colors.accent }: StatCardProps) {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({
    // no props needed — we use a worklet-based style instead
  }));

  // Use a simple approach: track counter with state from reanimated
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    let start = 0;
    const step = value / 50;
    const timer = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplayValue(Math.floor(start));
      if (start >= value) clearInterval(timer);
    }, 24);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <GlassPanel style={styles.card}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.value, { color }]}>
        {prefix}{displayValue.toLocaleString()}{suffix}
      </Text>
      <Text style={styles.label}>{label}</Text>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    fontFamily: "JetBrainsMono_400Regular",
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: "center",
    fontFamily: "JetBrainsMono_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

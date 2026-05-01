import React, { useEffect, useRef } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";

const BAR_COUNT = 16;
const BAR_WIDTH = 4;
const BAR_GAP = 4;
const MAX_HEIGHT = 72;
const MIN_HEIGHT = 4;

// Natural frequency distribution — centre bars taller
const BASE_HEIGHTS = [0.15, 0.2, 0.35, 0.5, 0.65, 0.75, 0.85, 1.0,
                      1.0, 0.85, 0.75, 0.65, 0.5, 0.35, 0.2, 0.15];

function Bar({ index, level, isActive }: { index: number; level: number; isActive: boolean }) {
  const height = useSharedValue(MIN_HEIGHT);

  useEffect(() => {
    if (isActive) {
      // Drive bar height from mic metering level (0–1)
      const variation = 0.4 + Math.random() * 0.6;
      const target = Math.max(
        MIN_HEIGHT,
        level * MAX_HEIGHT * BASE_HEIGHTS[index] * variation
      );
      height.value = withTiming(target, { duration: 80, easing: Easing.out(Easing.quad) });
    } else {
      // Idle wave animation
      const base = BASE_HEIGHTS[index] * MAX_HEIGHT * 0.25;
      height.value = withDelay(
        index * 40,
        withRepeat(
          withSequence(
            withTiming(base * 1.6, { duration: 600 + index * 30 }),
            withTiming(base * 0.5, { duration: 600 + index * 30 })
          ),
          -1,
          false
        )
      );
    }
  }, [isActive, level]);

  // Color gradient: cyan centre, blue/violet edges
  const centerDistance = Math.abs(index - (BAR_COUNT / 2 - 0.5)) / (BAR_COUNT / 2);
  const barColor = centerDistance < 0.3 ? Colors.cyan
    : centerDistance < 0.6 ? Colors.accent
    : Colors.violet;

  const animStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        styles.bar,
        animStyle,
        {
          backgroundColor: barColor,
          width: BAR_WIDTH,
          marginHorizontal: BAR_GAP / 2,
          shadowColor: barColor,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isActive ? 0.9 : 0.4,
          shadowRadius: isActive ? 6 : 2,
          elevation: isActive ? 6 : 2,
        },
      ]}
    />
  );
}

interface WaveformVisualizerProps {
  level: number;   // 0–1 normalised from mic metering
  isActive: boolean;
}

export function WaveformVisualizer({ level, isActive }: WaveformVisualizerProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: BAR_COUNT }, (_, i) => (
        <Bar key={i} index={i} level={level} isActive={isActive} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: MAX_HEIGHT + 8,
  },
  bar: {
    borderRadius: 3,
  },
});

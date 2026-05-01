import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";

interface OrbCanvasProps {
  height?: number;
  showParticles?: boolean;
}

export function OrbCanvas({ height = 220 }: OrbCanvasProps) {
  const outerScale = useSharedValue(1);
  const innerScale = useSharedValue(1);
  const ring1Opacity = useSharedValue(0.4);
  const ring2Opacity = useSharedValue(0.15);
  const ring1Scale = useSharedValue(1);
  const ring2Scale = useSharedValue(1);

  React.useEffect(() => {
    outerScale.value = withRepeat(
      withSequence(withTiming(1.07, { duration: 2200 }), withTiming(1, { duration: 2200 })),
      -1, false
    );
    innerScale.value = withRepeat(
      withSequence(withTiming(1.18, { duration: 1300 }), withTiming(0.88, { duration: 1300 })),
      -1, false
    );
    ring1Opacity.value = withRepeat(
      withSequence(withTiming(0.85, { duration: 1700 }), withTiming(0.2, { duration: 1700 })),
      -1, false
    );
    ring2Opacity.value = withRepeat(
      withSequence(withTiming(0.5, { duration: 2500 }), withTiming(0.05, { duration: 2500 })),
      -1, false
    );
    ring1Scale.value = withRepeat(
      withSequence(withTiming(1.06, { duration: 1700 }), withTiming(0.97, { duration: 1700 })),
      -1, false
    );
    ring2Scale.value = withRepeat(
      withSequence(withTiming(0.96, { duration: 2500 }), withTiming(1.08, { duration: 2500 })),
      -1, false
    );
  }, []);

  const outerStyle = useAnimatedStyle(() => ({ transform: [{ scale: outerScale.value }] }));
  const innerStyle = useAnimatedStyle(() => ({ transform: [{ scale: innerScale.value }] }));
  const ring1Style = useAnimatedStyle(() => ({
    opacity: ring1Opacity.value,
    transform: [{ scale: ring1Scale.value }],
  }));
  const ring2Style = useAnimatedStyle(() => ({
    opacity: ring2Opacity.value,
    transform: [{ scale: ring2Scale.value }],
  }));

  const orb = Math.min(height * 0.62, 148);
  const core = orb * 0.52;

  return (
    <View style={[styles.container, { height }]}>
      {/* Outermost halo */}
      <Animated.View style={[styles.ring, ring2Style, {
        width: orb * 1.65, height: orb * 1.65,
        borderRadius: orb * 0.825, borderColor: Colors.violet,
      }]} />
      {/* Mid ring */}
      <Animated.View style={[styles.ring, ring1Style, {
        width: orb * 1.28, height: orb * 1.28,
        borderRadius: orb * 0.64, borderColor: Colors.accent,
      }]} />
      {/* Outer glow sphere */}
      <Animated.View style={[styles.outerOrb, outerStyle, {
        width: orb, height: orb, borderRadius: orb / 2,
      }]} />
      {/* Inner pulsing core */}
      <Animated.View style={[styles.core, innerStyle, {
        width: core, height: core, borderRadius: core / 2,
      }]} />
    </View>
  );
}

// Keep alias so any leftover imports don't break
export { OrbCanvas as OrbFallback };

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  outerOrb: {
    position: "absolute",
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(59, 130, 246, 0.45)",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 36,
    elevation: 14,
  },
  core: {
    position: "absolute",
    backgroundColor: "rgba(6, 182, 212, 0.6)",
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 18,
  },
});

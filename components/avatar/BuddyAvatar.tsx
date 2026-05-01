import React from "react";
import { View, Image, StyleSheet, ImageSourcePropType } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "@/constants/theme";

// The three avatar variants — map index 0/1/2 to each image
export const AVATAR_SOURCES: ImageSourcePropType[] = [
  require("../../assets/avatar-1.jpg"),
  require("../../assets/avatar-2.png"),
  require("../../assets/avatar-3.png"),
];

interface BuddyAvatarProps {
  size?: number;
  animate?: boolean;
  variant?: 0 | 1 | 2;
}

export function BuddyAvatar({ size = 64, animate = true, variant = 0 }: BuddyAvatarProps) {
  const floatY = useSharedValue(0);
  const glowOpacity = useSharedValue(0.6);

  React.useEffect(() => {
    if (!animate) return;
    floatY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1600 }),
        withTiming(0, { duration: 1600 })
      ),
      -1,
      false
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0.4, { duration: 1200 })
      ),
      -1,
      false
    );
  }, [animate]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.wrapper}>
      {/* Animated glow ring */}
      <Animated.View
        style={[
          styles.glowRing,
          glowStyle,
          {
            width: size + 16,
            height: size + 16,
            borderRadius: (size + 16) / 2,
          },
        ]}
      />
      <Animated.View style={floatStyle}>
        <View
          style={[
            styles.avatar,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
            },
          ]}
        >
          <Image
            source={AVATAR_SOURCES[variant]}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            resizeMode="cover"
          />
        </View>
        {/* Online dot */}
        <View
          style={[
            styles.statusDot,
            { bottom: size * 0.04, right: size * 0.04 },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.cyan,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    borderWidth: 2,
    borderColor: Colors.accent,
    overflow: "hidden",
    backgroundColor: Colors.surface2,
  },
  statusDot: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: Colors.background,
  },
});

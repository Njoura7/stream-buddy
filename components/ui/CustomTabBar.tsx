import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Colors } from "@/constants/theme";

const TAB_ICONS: Record<string, string> = {
  index: "⌂",
  chat: "💬",
  buddy: "🎙",
  alerts: "🔔",
  settings: "⚙",
};

const TAB_LABELS: Record<string, string> = {
  index: "Home",
  chat: "Chat",
  buddy: "Buddy",
  alerts: "Alerts",
  settings: "Settings",
};

function TabItem({
  name,
  isFocused,
  onPress,
  badgeCount,
}: {
  name: string;
  isFocused: boolean;
  onPress: () => void;
  badgeCount?: number;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    scale.value = withSpring(1.2, { damping: 10 }, () => {
      scale.value = withSpring(1);
    });
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity
      style={styles.tabItem}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
          {TAB_ICONS[name] ?? "●"}
        </Text>
        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {TAB_LABELS[name] ?? name}
        </Text>
        {isFocused && <View style={styles.activeIndicator} />}
        {badgeCount != null && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeCount}</Text>
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const Inner = (
    <View style={styles.tabRow}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            name={route.name}
            isFocused={isFocused}
            onPress={onPress}
            badgeCount={route.name === "alerts" ? 3 : undefined}
          />
        );
      })}
    </View>
  );

  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={30} tint="dark" style={styles.bar}>
        {Inner}
      </BlurView>
    );
  }

  return <View style={[styles.bar, styles.barFallback]}>{Inner}</View>;
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingBottom: Platform.OS === "ios" ? 24 : 8,
    paddingTop: 8,
  },
  barFallback: {
    backgroundColor: "rgba(10, 11, 20, 0.95)",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
  },
  tabContent: {
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 8,
  },
  tabIcon: {
    fontSize: 22,
    color: Colors.textMuted,
    marginBottom: 3,
  },
  tabIconActive: {
    color: Colors.cyan,
  },
  tabLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tabLabelActive: {
    color: Colors.cyan,
  },
  activeIndicator: {
    position: "absolute",
    bottom: -6,
    width: 24,
    height: 2,
    backgroundColor: Colors.cyan,
    borderRadius: 1,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
});

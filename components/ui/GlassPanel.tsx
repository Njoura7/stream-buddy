import React from "react";
import { StyleSheet, View, ViewStyle, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/theme";

interface GlassPanelProps {
  children: React.ReactNode;
  intensity?: number;
  style?: ViewStyle | ViewStyle[];
}

export function GlassPanel({ children, intensity = 20, style }: GlassPanelProps) {
  if (Platform.OS === "ios") {
    return (
      <BlurView intensity={intensity} tint="dark" style={[styles.panel, style]}>
        {children}
      </BlurView>
    );
  }

  return (
    <View style={[styles.panelFallback, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    padding: 16,
  },
  panelFallback: {
    backgroundColor: "rgba(15, 17, 35, 0.92)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
});

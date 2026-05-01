import React, { useState } from "react";
import { ScrollView, View, Text, Image, StyleSheet, Switch, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { BuddyAvatar, AVATAR_SOURCES } from "@/components/avatar/BuddyAvatar";
import { Colors } from "@/constants/theme";

interface SettingRowProps {
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
}

function SettingRow({ label, sublabel, right }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingLabel}>{label}</Text>
        {sublabel ? <Text style={styles.settingSublabel}>{sublabel}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export default function SettingsScreen() {
  const [aiSuggestions, setAiSuggestions] = useState(true);
  const [toxicFilter, setToxicFilter] = useState(true);
  const [alertSound, setAlertSound] = useState(false);
  const [aiSensitivity, setAiSensitivity] = useState<"low" | "medium" | "high">("medium");
  const [avatarVariant, setAvatarVariant] = useState<0 | 1 | 2>(0);

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
            <Text style={styles.headerTitle}>SETTINGS</Text>
          </Animated.View>

          {/* Profile card */}
          <Animated.View entering={FadeInDown.delay(60)}>
            <GlassPanel style={styles.profileCard}>
              <View style={styles.profileRow}>
                <BuddyAvatar size={72} variant={avatarVariant} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>njoura</Text>
                  <Text style={styles.profileTag}>{"<{Web.Dev}>"}</Text>
                  <View style={styles.profileBadge}>
                    <Text style={styles.profileBadgeText}>✓ Affiliate</Text>
                  </View>
                </View>
              </View>

              {/* Avatar variant picker */}
              <View style={styles.avatarPicker}>
                <Text style={styles.avatarPickerLabel}>AVATAR SKIN</Text>
                <View style={styles.avatarPickerRow}>
                  {AVATAR_SOURCES.map((src, i) => (
                    <Pressable
                      key={i}
                      onPress={() => setAvatarVariant(i as 0 | 1 | 2)}
                      style={[
                        styles.avatarThumb,
                        avatarVariant === i && styles.avatarThumbActive,
                      ]}
                    >
                      <Image
                        source={src}
                        style={styles.avatarThumbImage}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            </GlassPanel>
          </Animated.View>

          {/* BuddyAI Settings */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text style={styles.sectionTitle}>BUDDY AI CONFIG</Text>
            <GlassPanel style={styles.section}>
              <SettingRow
                label="AI Suggestions"
                sublabel="Show real-time coaching tips"
                right={
                  <Switch
                    value={aiSuggestions}
                    onValueChange={setAiSuggestions}
                    trackColor={{ false: Colors.surface2, true: Colors.accent }}
                    thumbColor={aiSuggestions ? Colors.glow : Colors.textMuted}
                  />
                }
              />
              <View style={styles.divider} />
              <SettingRow
                label="Toxic Filter"
                sublabel="Auto-flag harmful messages"
                right={
                  <Switch
                    value={toxicFilter}
                    onValueChange={setToxicFilter}
                    trackColor={{ false: Colors.surface2, true: "#10B981" }}
                    thumbColor={toxicFilter ? "#fff" : Colors.textMuted}
                  />
                }
              />
              <View style={styles.divider} />
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={styles.settingLabel}>Sensitivity</Text>
                  <Text style={styles.settingSublabel}>AI alert threshold</Text>
                </View>
                <View style={styles.segmented}>
                  {(["low", "medium", "high"] as const).map((v) => (
                    <Pressable
                      key={v}
                      style={[
                        styles.segmentBtn,
                        aiSensitivity === v && styles.segmentBtnActive,
                      ]}
                      onPress={() => setAiSensitivity(v)}
                    >
                      <Text
                        style={[
                          styles.segmentText,
                          aiSensitivity === v && styles.segmentTextActive,
                        ]}
                      >
                        {v[0].toUpperCase() + v.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </GlassPanel>
          </Animated.View>

          {/* Stream settings */}
          <Animated.View entering={FadeInDown.delay(140)}>
            <Text style={styles.sectionTitle}>STREAM</Text>
            <GlassPanel style={styles.section}>
              <SettingRow
                label="Alert Sounds"
                right={
                  <Switch
                    value={alertSound}
                    onValueChange={setAlertSound}
                    trackColor={{ false: Colors.surface2, true: Colors.accent }}
                    thumbColor={alertSound ? Colors.glow : Colors.textMuted}
                  />
                }
              />
              <View style={styles.divider} />
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={styles.settingLabel}>Stream Key</Text>
                  <Text style={styles.settingSublabel}>••••••••••••••••</Text>
                </View>
                <Pressable style={styles.editBtn}>
                  <Text style={styles.editBtnText}>Edit</Text>
                </Pressable>
              </View>
            </GlassPanel>
          </Animated.View>

          {/* Appearance */}
          <Animated.View entering={FadeInDown.delay(180)}>
            <Text style={styles.sectionTitle}>APPEARANCE</Text>
            <GlassPanel style={styles.section}>
              <SettingRow
                label="Theme"
                sublabel="Dark (locked)"
                right={
                  <Text style={styles.lockedText}>🔒</Text>
                }
              />
            </GlassPanel>
          </Animated.View>

          {/* Backend */}
          <Animated.View entering={FadeInDown.delay(220)}>
            <Text style={styles.sectionTitle}>BACKEND</Text>
            <GlassPanel style={styles.section}>
              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Text style={styles.settingLabel}>Supabase</Text>
                  <Text style={styles.settingSublabel}>Live data connection</Text>
                </View>
                <View style={styles.notConnectedBadge}>
                  <Text style={styles.notConnectedText}>Not connected</Text>
                </View>
              </View>
            </GlassPanel>
          </Animated.View>

          {/* App info */}
          <Animated.View entering={FadeInDown.delay(260)} style={styles.appInfo}>
            <Text style={styles.appVersion}>StreamBuddy v1.0.0</Text>
            <Text style={styles.appBy}>by njoura · Web Dev Streamer</Text>
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
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: "Orbitron_700Bold",
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  profileCard: {
    marginBottom: 20,
  },
  avatarPicker: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  avatarPickerLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  avatarPickerRow: {
    flexDirection: "row",
    gap: 10,
  },
  avatarThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  avatarThumbActive: {
    borderColor: Colors.cyan,
    shadowColor: Colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarThumbImage: {
    width: 48,
    height: 48,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    color: Colors.textPrimary,
    fontFamily: "Orbitron_700Bold",
    letterSpacing: 1,
    marginBottom: 2,
  },
  profileTag: {
    fontSize: 13,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.4)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  profileBadgeText: {
    color: "#10B981",
    fontSize: 11,
    fontFamily: "JetBrainsMono_400Regular",
    fontWeight: "700",
  },
  sectionTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
    padding: 0,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  settingLeft: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  settingSublabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 14,
  },
  segmented: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  segmentBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "transparent",
  },
  segmentBtnActive: {
    backgroundColor: Colors.accent,
  },
  segmentText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
  },
  segmentTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  editBtn: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  editBtnText: {
    color: Colors.glow,
    fontSize: 12,
    fontFamily: "JetBrainsMono_400Regular",
  },
  lockedText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  notConnectedBadge: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  notConnectedText: {
    color: Colors.error,
    fontSize: 11,
    fontFamily: "JetBrainsMono_400Regular",
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 16,
  },
  appVersion: {
    fontSize: 12,
    color: Colors.textMuted,
    fontFamily: "JetBrainsMono_400Regular",
  },
  appBy: {
    fontSize: 11,
    color: "rgba(107, 114, 128, 0.5)",
    fontFamily: "JetBrainsMono_400Regular",
    marginTop: 3,
  },
});

import { Tabs } from "expo-router";
import { CustomTabBar } from "@/components/ui/CustomTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="buddy" />
      <Tabs.Screen name="alerts" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}

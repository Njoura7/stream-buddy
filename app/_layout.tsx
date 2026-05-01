import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts, Orbitron_700Bold } from "@expo-google-fonts/orbitron";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Orbitron_700Bold,
    JetBrainsMono_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0A0B14" }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}

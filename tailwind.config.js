/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0A0B14",
        surface: "#0F1123",
        surface2: "#151829",
        accent: "#3B82F6",
        cyan: "#06B6D4",
        violet: "#7C3AED",
        glow: "#60A5FA",
        textPrimary: "#F0F4FF",
        textMuted: "#6B7280",
      },
      fontFamily: {
        orbitron: ["Orbitron_700Bold"],
        mono: ["JetBrainsMono_400Regular"],
      },
    },
  },
  plugins: [],
};

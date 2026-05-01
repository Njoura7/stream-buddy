module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo",
      "nativewind/babel", // must be a preset — returns { plugins: [...] }
    ],
    plugins: [
      "react-native-reanimated/plugin", // must be last
    ],
  };
};

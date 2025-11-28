module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel", // <--- MOVED: This belongs in PRESETS now
    ],
    plugins: [
      // "nativewind/babel", <--- REMOVED: Do not put this here
      "react-native-reanimated/plugin",
    ],
  };
};
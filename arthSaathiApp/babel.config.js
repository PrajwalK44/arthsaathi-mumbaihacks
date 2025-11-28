module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }]],
    plugins: [
      // NativeWind should be applied as a plugin
      'nativewind/babel',
      // react-native-reanimated's plugin must be last in the plugins array
      'react-native-reanimated/plugin',
    ],
  }
}

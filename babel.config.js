module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      './babel-plugin-strip-import-meta.js',
      'react-native-worklets/plugin',
    ],
  };
};

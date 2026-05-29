module.exports = (options) => ({
  ...options,
  watchOptions: {
    poll: 1000,
    ignored: /node_modules/,
  },
  resolve: {
    ...options.resolve,
    extensionAlias: {
      '.js': ['.ts', '.js'],
      '.mjs': ['.mts', '.mjs'],
    },
  },
});

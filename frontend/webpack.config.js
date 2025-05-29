const webpack = require('webpack');

module.exports = {
  // Add webpack polyfills for Node.js core modules
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ],
  resolve: {
    fallback: {
      buffer: require.resolve('buffer/'),
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
    },
  },
};

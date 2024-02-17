// webpack.config.js
module.exports = {
  // ... Diğer konfigürasyonlar
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
    },
  },
};

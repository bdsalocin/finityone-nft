// webpack.config.js
const webpack = require("webpack");

module.exports = {
  // ... autres configurations
  plugins: [
    // Autres plugins
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"), // Assurez-vous que ce chemin est correct
    },
  },
};

const path = require("path");

module.exports = {
  entry: {
    anki: "./card/ts/anki-index.ts",
    web: "./card/ts/web-index.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name]_bundle.js",
    path: path.resolve(__dirname, "dist/card"),
  },
  mode: "production",
};

const path = require("path");

module.exports = {
  entry: ["./src/ts/index.ts"],
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
    filename: "_bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "production",
};

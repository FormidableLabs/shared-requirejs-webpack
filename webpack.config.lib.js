var path = require("path");
var webpack = require("webpack");

var OPTIMIZE = process.env.OPTIMIZE === "true";

module.exports = {
  context: path.join(__dirname, "client"),
  entry: {
    lib: ["./lib"]
  },
  output: {
    path: path.join(__dirname, "dist/webpack"),
    filename: "[name]" + (OPTIMIZE ? ".min" : "") + ".js",
    library: "[name]_[hash]"
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dist/webpack/[name]-manifest" + (OPTIMIZE ? ".min" : "") + ".json"),
      name: "[name]_[hash]"
    })
  ].concat(OPTIMIZE ? [
    new webpack.optimize.UglifyJsPlugin()
  ] : [])
};

"use strict";
var path = require("path");
var webpack = require("webpack");

var OPTIMIZE = process.env.OPTIMIZE === "true";
var OPT_EXT = OPTIMIZE ? ".min" : "";

module.exports = {
  context: path.join(__dirname, "client"),
  entry: {
    lib: ["./lib"]
  },
  output: {
    path: path.join(__dirname, "dist/webpack"),
    filename: "[name]" + OPT_EXT + ".js",
    library: "[name]_[hash]"
  },
  resolve: {
    alias: {
      "client": path.join(__dirname, "client")
    }
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dist/webpack/[name]-manifest" + OPT_EXT + ".json"),
      name: "[name]_[hash]"
    })
  ].concat(OPTIMIZE ? [
    new webpack.optimize.UglifyJsPlugin()
  ] : [])
};

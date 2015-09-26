"use strict";
var path = require("path");
var webpack = require("webpack");

var OPTIMIZE = process.env.OPTIMIZE === "true";
var OPT_EXT = OPTIMIZE ? ".min" : "";

module.exports = {
  context: path.join(__dirname, "client"),
  entry: {
    app: "./app.js"
  },
  output: {
    path: path.join(__dirname, "dist/webpack"),
    filename: "[name]" + (OPTIMIZE ? ".min" : "") + ".js"
  },
  resolve: {
    alias: {
      "client": path.join(__dirname, "client")
    }
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, "client"),
      manifest: require("./dist/webpack/lib-manifest" + OPT_EXT + ".json")
    })
  ].concat(OPTIMIZE ? [
    new webpack.optimize.UglifyJsPlugin()
  ] : [])
};

var path = require("path");
var webpack = require("webpack");

var OPTIMIZE = process.env.OPTIMIZE === "true";

module.exports = {
  context: path.join(__dirname, "client"),
  entry: {
    app: "./app.js"
  },
  output: {
    path: path.join(__dirname, "dist/webpack"),
    filename: "[name]" + (OPTIMIZE ? ".min" : "") + ".js"
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, "client"),
      manifest: require("./dist/webpack/lib-manifest" + (OPTIMIZE ? ".min" : "") + ".json")
    })
  ].concat(OPTIMIZE ? [
    new webpack.optimize.UglifyJsPlugin()
  ] : [])
};

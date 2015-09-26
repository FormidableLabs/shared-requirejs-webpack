"use strict";
var path = require("path");
var webpack = require("webpack");
var stripLoader = path.join(__dirname, "lib/webpack/strip-sourcemaps-loader.js");

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
  module: {
    preLoaders: [
      // Strip Handlebars inlined sourcemap comments.
      { test: /node_modules\/handlebars\/.*\.js$/, loader: stripLoader }
    ],
    loaders: [
      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
        query: {
          // Use runtime build.
          runtime: require.resolve("handlebars/runtime")
        }
      }
    ]
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
    }),
    // Rewrite "hbs!/path/to/template" to "/path/to/template.hbs" for
    // compatibility with `hbs!` in RequireJS land.
    new webpack.NormalModuleReplacementPlugin(/^hbs!+/, function (result) {
      result.request = result.request.slice(4) + ".hbs";
    })
  ].concat(OPTIMIZE ? [
    new webpack.optimize.UglifyJsPlugin()
  ] : [])
};

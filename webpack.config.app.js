"use strict";
var path = require("path");
var webpack = require("webpack");
var stripLoader = path.join(__dirname, "lib/webpack/strip-sourcemaps-loader.js");

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
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, "client"),
      manifest: require("./dist/webpack/lib-manifest" + OPT_EXT + ".json")
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

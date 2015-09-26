"use strict";

/**
 * Consume Webpack DLL and create RequireJS interop.
 *
 * This is the "hacky" string-based version.
 */
var fs = require("fs");
var requirejs = require("requirejs");

console.log(require("path").normalize("./foo"));
console.log(requirejs.optimize.toString());

// TODO: Write an actual CLI.
// TODO: Abstract to command-line path.
var manifest = require("../dist/webpack/lib-manifest.json");

var template = function (data) {
  return [].concat(
    [
      "(function () {",
      "  var lib = window[\"" + data.name + "\"];"
    ],
    Object.keys(data.content).map(function (name) {
      return "  //" + name;
    }),
    [
      "}());"
    ]).join("\n");
};

console.log("TODO HERE manifest\n\n" + template(manifest));

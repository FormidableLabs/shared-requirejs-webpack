"use strict";

/**
 * Consume Webpack DLL and create RequireJS interop.
 *
 * This is the "hacky" string-based version.
 */
var requirejs = require("requirejs");

// TODO: Write an actual CLI.
// TODO: Abstract to command-line path argument (optional).
// TODO: Test (1) w/ config, (2) w/o config
var requireCfg = require("../requirejs.config");

// Configure RequireJS.
requirejs.config(requireCfg);

// TODO: Abstract to command-line path argument (required).
var manifest = require("../dist/webpack/lib-manifest.json");


/*eslint-disable no-console*/
console.log(require("path").normalize("./foo"));
console.log(JSON.stringify(requirejs.s.contexts._, null, 2));
/*eslint-enable no-console*/


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

// TODO: Real output.
/*eslint-disable no-console*/
console.log(template(manifest));
/*eslint-enable no-console*/

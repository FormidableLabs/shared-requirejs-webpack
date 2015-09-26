"use strict";
// TODO: Write an actual CLI.

/**
 * Consume Webpack DLL and create RequireJS interop.
 *
 * This is the "hacky" string-based version.
 */
var path = require("path");
var _ = require("lodash");
var requirejs = require("requirejs");
var madge = require("madge");

// TODO: Abstract to command-line path argument (required).
var REQUIREJS_LIB_PATH = path.join(__dirname, "../dist/requirejs/lib.js");

// Infer the names of _everything_ **defined** by RequireJS in the lib.
var requirejsDepTree = madge(REQUIREJS_LIB_PATH, {
  format: "amd"
});
// Flatten the tree (should be only one key w/ all deps).
var requirejsNames = _(requirejsDepTree.tree)
  .values()
  .flatten()
  .value();

// TODO: Abstract to command-line path argument (optional).
// TODO: Test (1) w/ config, (2) w/o config
var requireCfg = require("../requirejs.config");

// Configure RequireJS.
requirejs.config(requireCfg);

// TODO: Abstract to command-line path argument (required).
var manifest = require("../dist/webpack/lib-manifest.json");


/*eslint-disable no-console*/
//console.log(require("path").normalize("./foo"));
console.log(JSON.stringify(requirejsNames));
//console.log(JSON.stringify(requirejs.s.contexts._, null, 2));
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

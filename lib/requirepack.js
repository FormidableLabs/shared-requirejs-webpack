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

// ----------------------------------------------------------------------------
// RequireJS Deps
// --------------
// This section reads in files for RequireJS:
//
// - The **built** lib.js for dependency analysis of what names we need.
// - The RequireJS configuration for path mapping.
//
// These paths are slightly normalized, but maintain RequireJS prefixes and
// can have duplicates.
// ----------------------------------------------------------------------------
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

// ----------------------------------------------------------------------------
// Webpack
// -------
// This section reads in files for Webpack:
//
// - The manifest of what's in the lib.js configuration
//
// These paths are _normalized_ to relative file paths for Webpack.
// ----------------------------------------------------------------------------
// TODO: Abstract to command-line path argument (required).
var manifest = require("../dist/webpack/lib-manifest.json");
var wpLibName = manifest.name;

// Normalize webpack dependency paths for RequireJS matching.
var wpNormalize = function (wpPath) {
  return path.normalize(wpPath)
    // Remove extensions.
    // TODO: Get extensions list from RequireJS configuration.
    .replace(/\.js$/, "");
}

// Get starting dependency map.
var wpDepMap = _(manifest.content)
  .pairs()
  .map(function (pair) {
    return [wpNormalize(pair[0]), pair[1]];
  })
  .object()
  .value();

/*eslint-disable no-console*/
//console.log(require("path").normalize("./foo"));
console.log(JSON.stringify(wpDepMap, null, 2));
//console.log(JSON.stringify(requirejs.s.contexts._, null, 2));
/*eslint-enable no-console*/

// Actual lookup.
var getWpNum = function (rjsName) {
  var match;

  // First see if we have a straight match.
  match = wpDepMap[rjsName];
  if (match) { return match; }

  return "TODO - " + rjsName;
};

var template = function () {
  return [].concat(
    [
      "(function () {",
      "  var lib = window[\"" + wpLibName + "\"];",
      "  function wpToRjs(num) { return lib(num); }"
    ],
    _.map(requirejsNames, function (name) {
      return "  define(\"" + name + "\", wpToRjs(" + getWpNum(name) + "));"
    }),
    [
      "}());"
    ]).join("\n");
};

// TODO: Real output.
/*eslint-disable no-console*/
console.log(template(manifest));
/*eslint-enable no-console*/

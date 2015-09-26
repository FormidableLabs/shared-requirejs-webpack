"use strict";
// TODO: Write an actual CLI.

/**
 * Consume Webpack DLL and create RequireJS interop.
 *
 * This is the "hacky" string-based version.
 */
var path = require("path");
var _ = require("lodash");
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
var rjsDepTree = madge(REQUIREJS_LIB_PATH, {
  format: "amd"
});

// Flatten the tree (should be only one key w/ all deps).
var rjsNames = _(rjsDepTree.tree)
  .values()
  .flatten()
  .value();

// TODO: Abstract to command-line path argument (optional).
// TODO: Test (1) w/ config, (2) w/o config
var rjsCfg = require("../requirejs.config");

// Normalize RequireJS paths to be similar to Webpack manifest paths.
var rjsPathMap = _.mapValues(rjsCfg.paths, function (rjsPath) {
  return path.normalize(rjsPath);
});

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
};

// Get starting dependency map.
var wpDepMap = _(manifest.content)
  .pairs()
  .map(function (pair) {
    return [wpNormalize(pair[0]), pair[1]];
  })
  .object()
  .value();

/*eslint-disable no-console*/
// TODO: REMOVE ALL THIS.
//console.log(require("path").normalize("./foo"));
// console.log(JSON.stringify(wpDepMap, null, 2));
// console.log(JSON.stringify(rjsPathMap, null, 2));
//console.log(JSON.stringify(rjs.s.contexts._, null, 2));
/*eslint-enable no-console*/

// Actual lookup.
var getWpNum = function (rjsName) {
  var match;

  // First see if we have a straight match.
  match = wpDepMap[rjsName];
  if (match) { return match; }

  // Next iterate through all the RequireJS configuration path prefixes,
  // append, normalize and see if we have a match.
  // Use `_.some` to short-circuit on any match
  _.some(rjsPathMap, function (rjsPath, rjsPrefix) {
    // Check a straight match.
    // Usually, this would be a vendor library or such.
    if (rjsPrefix === rjsName) {
      match = wpDepMap[rjsPath];
      if (match) { return true; }
    }

    // Next, check a partial prefix with a boundary at a slash.
    var prefixIdx = rjsName.indexOf(rjsPrefix);
    if (prefixIdx === 0 && rjsName[rjsPrefix.length] === "/") {
      // Replace RequireJS name prefix with real path prefix.
      var rjsNameRemainder = rjsName.substr(rjsPrefix.length + 1);
      var rjsReplaced = path.normalize(path.join(rjsPath, rjsNameRemainder));
      match = wpDepMap[rjsReplaced];
      if (match) { return true; }
    }
  });
  if (match) { return match; }

  // TODO: rjs.maps need to be handled too.

  // Explicitly error on unmapped dependency.
  throw new Error("Could not match dependency for: " + rjsName);
};

var template = function () {
  return [].concat(
    [
      "(function () {",
      "  var lib = window[\"" + wpLibName + "\"];",
      "  function wpToRjs(num) { return function () { return lib(num); }; }"
    ],
    _.map(rjsNames, function (name) {
      return "  define(\"" + name + "\", wpToRjs(" + getWpNum(name) + "));";
    }),
    [
      "}());"
    ]).join("\n");
};

// TODO: Real output.
/*eslint-disable no-console*/
console.log(template(manifest));
/*eslint-enable no-console*/

"use strict";
// TODO: Write an actual CLI.

/**
 * Consume Webpack DLL and create RequireJS interop.
 *
 * This is the "hacky" string-based version.
 */
var fs = require("fs");
var path = require("path");
var _ = require("lodash");
var amdetective = require("amdetective");

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
var rjsLibSrc = fs.readFileSync(REQUIREJS_LIB_PATH).toString();

// TODO: Try to go off config + raw lib.js!!!
var rjsTree = amdetective(rjsLibSrc, {
  findNestedDependencies: false
});

// Convert to top-level names.
var rjsNames = _.pluck(rjsTree, "name");

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
var wpManifest = require("../dist/webpack/lib-manifest.json");
var wpCfg = require("../webpack.config.lib");
var wpLibName = wpManifest.name;

// Normalize webpack dependency paths for RequireJS matching.
var wpNormalize = function (wpPath) {
  return path.normalize(wpPath)
    // Remove extensions.
    // TODO: Get extensions list from RequireJS configuration.
    .replace(/\.js$/, "");
};

// Get starting dependency map.
var wpDepMap = _(wpManifest.content)
  .pairs()
  .map(function (pair) {
    return [wpNormalize(pair[0]), pair[1]];
  })
  .object()
  .value();

// ----------------------------------------------------------------------------
// Configurations
// --------------
// Global configurations for things that cannot be automatically inferred.
// ----------------------------------------------------------------------------
// TODO: Canonicalize
// TODO: Also expose via CLI flags
var CONFIG = {
  // Context matching that of Webpack building DLL (i.e., what's in the
  // manifest).
  context: wpCfg.context,

  // The following resolution overrides occur in order of this configuration.

  // RequireJS dependency names to simply ignore with a noop.
  //
  // TODO: Accept a regex too.
  noops: [
    "hbs" // Plugin should never be _directly_ called.
  ],

  // Transforms occur in order and do not stop after first match.
  transforms: [
    // Match the NormalModuleReplacementPlugin path switch we do in Webpack
    // for HBS files and the `hbs!` plugin
    {
      test: /^hbs!+/,
      transform: function (name) {
        return name.slice(4) + ".hbs";
      }
    }
  ],

  // Mappings of RequireJS dependency name to Webpack-friendly names that
  // correspond to NPM packages (which can often differ from RequireJS +
  // Bower/A Plugin to Webpack + NPM).
  //
  // Path will be `require.resolve()`'ed relative to webpack build root so
  // that it matches up with DLL context.
  npmMap: {
    "hbs/handlebars": "handlebars/runtime"
  }
};

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Infer noops.
var isWpNoop = function (rjsName) {
  return CONFIG.noops.indexOf(rjsName) > -1;
};

// Actual lookup.
// TODO: Decompose, better abstract, reduce complexity
/*eslint-disable max-statements*/
var getWpNum = function (rjsName) {
  var match;

  // Apply any transforms that match.
  _.each(CONFIG.transforms, function (obj) {
    if (obj.test.test(rjsName)) {
      rjsName = obj.transform(rjsName);
    }
  });

  // Convert name with explicit overrides.
  // Try NPM mappings.
  // TODO: Handle prefixes (ugh).
  var npmName = CONFIG.npmMap[rjsName];
  if (npmName) {
    // NPM names **must** resolve. A module import error here is a real error.
    var npmPath = require.resolve(npmName);

    // Get relative path to match manifest.
    npmPath = path.relative(CONFIG.context, npmPath);

    // Now, normalize it for matching.
    npmPath = wpNormalize(npmPath);

    // Check for straight match.
    match = wpDepMap[npmPath];
    if (match) { return match; }
  }

  // See if we have a straight match.
  match = wpDepMap[rjsName];
  if (match) { return match; }

  // Iterate through all the RequireJS configuration path prefixes,
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

  // Explicitly error on unmapped dependency.
  throw new Error("Could not match dependency for: " + rjsName);
};
/*eslint-enable max-statements*/

// ----------------------------------------------------------------------------
// Script
// ----------------------------------------------------------------------------
/*eslint-disable no-console*/
// TODO: REMOVE ALL THIS.
// console.log(require("path").normalize("./foo"));
// console.log(JSON.stringify(wpDepMap, null, 2));
// console.log(JSON.stringify(rjsPathMap, null, 2));
// console.log(JSON.stringify(rjs.s.contexts._, null, 2));
// console.log(JSON.stringify(rjsNames, null, 2));
// throw new Error("HI");
/*eslint-enable no-console*/

var template = function () {
  return [].concat(
    [
      "(function () {",
      "  var lib = window[\"" + wpLibName + "\"];",
      "  function wpToRjs(num) { return function () { return lib(num); }; }"
    ],
    _.map(rjsNames, function (name) {
      var resolution;
      if (isWpNoop(name)) {
        // Noop.
        resolution = "function () {}";
      } else {
        // A Webpack-RequireJS mapping by number.
        resolution = "wpToRjs(" + getWpNum(name) + ")";
      }

      return "  define(\"" + name + "\", " + resolution + ");";
    }),
    [
      "}());"
    ]).join("\n");
};

// TODO: Real output.
/*eslint-disable no-console*/
console.log(template(wpManifest));
/*eslint-enable no-console*/

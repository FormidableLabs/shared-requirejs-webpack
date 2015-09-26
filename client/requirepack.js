/**
 * Bridge Webpack-created DLL to RequireJS shared library.
 */
(function () {
  /*eslint-disable consistent-this*/
  var root = this;
  /*eslint-enable consistent-this*/

  // Get the Webpack magic library variable.
  // TODO: Infer this generally using `lib-manifest.json` (`name`)
  var lib = root.lib_034978f70650cb28c705;

  // Load and `define()` all lib dependencies.
  // TODO: Infer this generally using `lib-manifest.json`
  // TODO: Iterate for _all_ dependencies.
  // TODO: "./foo" is normalized to "foo" in RJS bundle / namespace.
  //       See if we can get access to that function?
  // TODO: Temporary converter wrapper.
  var convert = function (requirejsName, webpackNum) {
    define(requirejsName, function () {
      return lib(webpackNum);
    });
  };

  /**
   * OBSERVATION: RequireJS & Double Defines
   * -----------
   * If there is `./foo` and `client/foo` that correspond to the **same**
   * underlying file:
   * - Webpack: Normalizes both to `./foo.js`
   * - RequireJS: Creates two separate entries with same code copied / pasted.
   */
  // 1: `lib.js` has no RequireJS namespace
  convert("foo", 2);
  convert("client/bar", 5);
  convert("foo-dep", 3);
  convert("client/foo-dep", 3);
  convert("bar-dep", 4);
  convert("client/bar-dep", 4);
  convert("jquery", 6);

  // TODO: Try different requires.
  /*eslint-disable no-console*/
  console.log("TODO HERE -- foo\b\n" + [
    // require("client/foo"), // Doesn't work because not in any RJS usage.
    require("foo"),
    require("./foo")
  ].join("\n"));
  /*eslint-enable no-console*/

}());

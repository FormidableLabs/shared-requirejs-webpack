/**
 * Bridge Webpack-created DLL to RequireJS shared library.
 */
(function () {
  /*eslint-disable consistent-this*/
  var root = this;
  /*eslint-enable consistent-this*/

  // Get the Webpack magic library variable.
  // TODO: Infer this generally using `lib-manifest.json` (`name`)
  var lib = root.lib_4d135b57933a4f4ca829;

  // Load and `define()` all lib dependencies.
  // TODO: Infer this generally using `lib-manifest.json`
  // TODO: Iterate for _all_ dependencies.
  // TODO: "./foo" is normalized to "foo" in RJS bundle / namespace.
  //       See if we can get access to that function?
  var fooId = 2;
  define("foo", function () {
    return lib(fooId);
  });

  /*eslint-disable no-console*/
  console.log("TODO HERE -- foo", require("./foo"));
  /*eslint-enable no-console*/

}());

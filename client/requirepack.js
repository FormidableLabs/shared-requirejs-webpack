/**
 * Bridge Webpack-created DLL to RequireJS shared library.
 */
/*eslint-disable func-style, dot-notation*/
(function () {
  var lib = window["lib_c50c4852ce95aaa6938f"];
  function wpToRjs(num) { return function () { return lib(num); }; }
  define("foo-dep", wpToRjs(3));
  define("bar-dep", wpToRjs(4));
  define("hbs/handlebars", wpToRjs(6));
  define("hbs", function () {});
  define("hbs!foo", wpToRjs(5));
  define("foo", wpToRjs(2));
  define("client/foo-dep", wpToRjs(3));
  define("client/bar-dep", wpToRjs(4));
  define("hbs!client/bar-tmpl", wpToRjs(26));
  define("client/bar", wpToRjs(25));
  define("jquery", wpToRjs(27));
  define("lib", wpToRjs(1));
}());

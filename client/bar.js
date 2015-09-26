define([
  "client/foo-dep",
  "client/bar-dep",
  "hbs!client/bar-tmpl"
], function (fooDep, barDep, tmpl) {
  // SIDE NOTE: Webpack `handlebars-loader` does poorly with top-level
  // properties that match file names (like `foo`, etc.)
  return tmpl({
    fooDep: fooDep,
    barDep: barDep
  });
});

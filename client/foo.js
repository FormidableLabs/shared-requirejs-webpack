define([
  "./foo-dep",
  "./bar-dep",
  "hbs!./foo"
], function (fooDep, barDep, tmpl) {
  // SIDE NOTE: Webpack `handlebars-loader` does poorly with top-level
  // properties that match file names (like `foo`, etc.)
  return tmpl({
    fooDep: fooDep,
    barDep: barDep
  });
});

define([
  "client/foo-dep",
  "client/bar-dep",
  "hbs!client/bar-tmpl"
], function (fooDep, barDep, tmpl) {
  return tmpl({
    foo: fooDep,
    bar: barDep
  });
});

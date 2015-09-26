define([
  "./foo-dep",
  "./bar-dep",
  "hbs!./foo"
], function (fooDep, barDep, tmpl) {
  return tmpl({
    foo: fooDep,
    bar: barDep
  });
});

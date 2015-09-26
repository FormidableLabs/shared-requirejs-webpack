define(["client/foo-dep", "client/bar-dep"], function (fooDep, barDep) {
  return "Hello. I'm bar. (" + fooDep + ") (" + barDep + ")";
});

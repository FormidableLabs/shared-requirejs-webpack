define(["./foo-dep", "./bar-dep"], function (fooDep, barDep) {
  return "Hello. I'm foo. (" + fooDep + ") (" + barDep + ")";
});

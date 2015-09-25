// BUG: Interlock can't handle this form (wp, rjs can).
// define([], "Hi. I'm foo.");
define([], function () {
  return "Hi. I'm foo.";
});

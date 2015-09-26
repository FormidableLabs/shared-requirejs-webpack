define([
  "jquery",
  "./foo",
  "client/bar"
], function ($, foo, bar) {
  $("body")
    .append(foo)
    .append(bar);
});

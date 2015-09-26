define([
  "jquery",
  "./foo",
  "client/bar"
], function ($, foo, bar) {
  $("body")
    .append($("<h2>Foo</h2>"))
    .append($("<code />").text(foo))
    .append($("<h2>Bar</h2>"))
    .append($("<code />").text(bar));
});

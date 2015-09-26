define([
  "./foo",        // Relative path (with nested dep)
  "client/bar",   // Custom app prefixed path (with nested prefixed dep)
  "jquery"        // Vendor path
], function () {});

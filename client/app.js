define(["./foo"], function (foo) {
  var msg = document.createElement("h1");
  msg.innerHTML = foo;
  document.body.appendChild(msg);
});

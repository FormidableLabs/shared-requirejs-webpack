({
  appDir: "client",
  baseUrl: ".",
  dir: "build/requirejs",
  modules: [
    {
      name: "lib.min",
      create: true,
      include: ["lib"]
      // Note: Add "../node_modules/almond/almond" for combined lib build.
    },
    {
      name: "app.min",
      create: true,
      include: ["app"],
      exclude: ["lib"],       // Lib is shared dependency
      insertRequire: ["app"]  // Actually execute `app` entry point
    }
  ],
  optimize: "uglify2"
})
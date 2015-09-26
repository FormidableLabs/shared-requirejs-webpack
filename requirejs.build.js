// https://github.com/jrburke/r.js/blob/master/build/example.build.js
({
  appDir: "client",
  baseUrl: ".",
  dir: "build/requirejs",
  mainConfigFile: "./requirejs.config.js",
  modules: [
    {
      name: "lib"
      // Note: Add "../node_modules/almond/almond" for combined lib build.
    },
    {
      name: "app",
      exclude: ["lib"],       // Lib is shared dependency
      insertRequire: ["app"]  // Actually execute `app` entry point
    }
  ],
  optimize: "none"
})
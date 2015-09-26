(function () {
  // Hack: Make the config directly importable in Node/Grunt.
  if (typeof require.config === "undefined") {
    /*global module:false*/
    require.config = function (obj) { module.exports = obj; };
  }

  // Configure RequireJS.
  require.config({
    baseUrl: "./client",

    paths: {
      client: "./",
      jquery: "../node_modules/jquery/dist/jquery",
    }
  });
}());

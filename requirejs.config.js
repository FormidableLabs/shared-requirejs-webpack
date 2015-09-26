/*eslint-disable strict*/
(function () {
  // Hack: Make the config directly importable in Node/Grunt.
  if (typeof require.config === "undefined") {
    /*global module:false*/
    require.config = function (obj) { module.exports = obj; };
  }

  // Configure RequireJS.
  require.config({
    baseUrl: "./client",

    // HBS options / build.
    hbs: {
      helpers: false,
      i18n: false,
      disableI18n: true,
      compileOptions: {
        data: true
      }
    },
    pragmasOnSave: {
      // Removes Handlebars.Parser code (used to compile template strings).
      excludeHbsParser: true,
      // Kills the entire plugin set once it's built.
      excludeHbs: true,
      // Removes i18n precompiler, handlebars and json2
      excludeAfterBuild: true
    },

    map: {
      "*": {
        // Direct imports can only use runtime.
        "handlebars": "hbs/handlebars.runtime",
        "Handlebars": "hbs/handlebars.runtime"
      }
    },

    paths: {
      client: "./",
      jquery: "../node_modules/jquery/dist/jquery",
      hbs: "../node_modules/require-handlebars-plugin/hbs"
    }
  });
}());

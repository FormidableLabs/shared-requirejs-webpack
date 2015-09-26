[![Travis Status][trav_img]][trav_site]

Shared RequireJS / Webpack Common Libraries
===========================================

Early experiments for sharing a common library across Webpack / RequireJS.

### Build

```sh
$ npm run build
```

### Dev Server

```sh
$ npm run server
```

Navigate to: [http://127.0.0.1:4040/web/]() and see the following pages:

* [http://127.0.0.1:4040/web/requirejs.html](): Straight RequireJS build
* [http://127.0.0.1:4040/web/requirejs.min.html](): Minified RequireJS build
* [http://127.0.0.1:4040/web/webpack.html](): Straight Webpack build
* [http://127.0.0.1:4040/web/webpack.min.html](): Minified Webpack build
* [http://127.0.0.1:4040/web/requirepack.lib.html](): Interoperable Webpack-RequireJS library (automated)
* [http://127.0.0.1:4040/web/requirepack.manual.html](): Interoperable Webpack-RequireJS library (manual)

[trav_img]: https://api.travis-ci.org/FormidableLabs/shared-requirejs-webpack.svg
[trav_site]: https://travis-ci.org/FormidableLabs/shared-requirejs-webpack

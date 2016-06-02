var browserify = require('browserify');
var connect = require('gulp-connect');
var cssmin = require('gulp-cssmin');
var merge = require('merge-stream');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gulpif = require('gulp-if');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var watchify = require('watchify');

var files = {
  dependencies: [
    'react',
    'react-dom',
    'react-addons-transition-group',
    'react-addons-css-transition-group',
    'react-addons-update',
    'react-tap-event-plugin',
  ],

  browserify: [
    './src/main.js',
  ],

  css: [
    './node_modules/bootstrap/dist/css/bootstrap.min.css',
    './node_modules/bootstrap-material-design/dist/css/roboto.min.css',
    './node_modules/bootstrap-material-design/dist/css/material.min.css',
    './node_modules/bootstrap-material-design/dist/css/ripples.min.css',
    './src/components/data-table/styles/data-table-base.css',
    './src/components/data-table/styles/data-table-custom.css',
  ],

  fonts: [
    './node_modules/bootstrap/dist/fonts/*',
    './node_modules/bootstrap-material-design/dist/fonts/*',
  ],

  js: [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.min.js',
    './node_modules/bootstrap-material-design/dist/js/ripples.min.js',
    './node_modules/bootstrap-material-design/dist/js/material.min.js',
  ],
};

var browserifyTask = function (options) {

  var bundler = browserify({
    entries: [options.src],
    transform: [
      ['babelify', {presets: ['react']}],
    ],
    debug: options.development,
    cache: {}, // Requirement of watchify
    packageCache: {}, // Requirement of watchify
    fullPaths: options.development,
    alias: ['/node_modules/react/react.js:react'],
    extensions: ['.js', '.jsx', '.json'],
  });

  var rebundle = function () {
    var start = Date.now();
    console.log('Building APP bundle');
    return bundler
      .bundle()
      .on('error', gutil.log)
      .pipe(source(options.output))
      .pipe(gulpif(!options.development, streamify(uglify())))
      .pipe(gulp.dest(options.dest))
      .pipe(gulpif(options.development, connect.reload()))
      .pipe(notify(function () {
        console.log('APP bundle built in ' + (Date.now() - start) + 'ms');
      }));
  };

  bundler.external(files.dependencies);

  if (options.development) {
    bundler = watchify(bundler);
    bundler.on('update', rebundle);
  }

  return rebundle();

};

var browserifyDepsTask = function (options) {

  var vendorsBundler = browserify({
    debug: options.development,
    require: files.dependencies,
  });

  var start = new Date();
  console.log('Building VENDORS bundle');
  return vendorsBundler
    .bundle()
    .on('error', gutil.log)
    .pipe(source(options.output))
    .pipe(gulpif(!options.development, streamify(uglify())))
    .on('error', gutil.log)
    .pipe(gulp.dest(options.dest))
    .pipe(notify(function () {
      console.log('VENDORS bundle built in ' + (Date.now() - start) + 'ms');
    }));

};

var cssTask = function (options) {

  var start = new Date();
  console.log('Building CSS bundle');
  return gulp.src(options.src)
    .pipe(concat(options.output))
    .pipe(gulpif(!options.development, cssmin()))
    .pipe(gulp.dest(options.dest))
    .pipe(gulpif(options.development, connect.reload()))
    .pipe(notify(function () {
      console.log('CSS bundle built in ' + (Date.now() - start) + 'ms');
    }));

};

var jsTask = function (options) {

  var start = new Date();
  console.log('Building JS bundle');
  return gulp.src(options.src)
    .pipe(concat(options.output))
    .pipe(gulpif(!options.development, streamify(uglify())))
    .pipe(gulp.dest(options.dest))
    .pipe(gulpif(options.development, connect.reload()))
    .pipe(notify(function () {
      console.log('JS bundle built in ' + (Date.now() - start) + 'ms');
    }));

};

var fontsTask = function (options) {

  var start = new Date();
  console.log('Copying fonts');
  return gulp.src(files.fonts)
    .pipe(gulp.dest(options.dest))
    .on('end', function () {
      console.log('Fonts copied in ' + (Date.now() - start) + 'ms');
    });

};

gulp.task('deploy', function () {

  var browserifyDepsOpt = {
    development: false,
    src: files.dependencies,
    output: 'vendors.js',
    dest: './dist/scripts',
  };

  var browserifyOpt = {
    development: false,
    src: files.browserify,
    output: 'bundle.js',
    dest: './dist/scripts',
  };

  var cssOpt = {
    development: false,
    src: files.css,
    output: 'styles.css',
    dest: './dist/styles',
  };

  var jsOpt = {
    development: false,
    src: files.js,
    output: 'styles.js',
    dest: './dist/scripts',
  };

  var fontsOpt = {
    src: files.fonts,
    dest: './dist/fonts',
  };

  return merge(
    browserifyDepsTask(browserifyDepsOpt),
    browserifyTask(browserifyOpt),
    cssTask(cssOpt),
    jsTask(jsOpt),
    fontsTask(fontsOpt)
  );

});

gulp.task('default', function() {

  var browserifyDepsOpt = {
    development: true,
    src: files.dependencies,
    output: 'vendors.js',
    dest: './build/scripts',
  };

  var browserifyOpt = {
    development: true,
    src: files.browserify,
    output: 'bundle.js',
    dest: './build/scripts',
  };

  var cssOpt = {
    development: true,
    src: files.css,
    output: 'styles.css',
    dest: './build/styles',
  };

  var jsOpt = {
    development: true,
    src: files.js,
    output: 'styles.js',
    dest: './build/scripts',
  };

  var fontsOpt = {
    src: files.fonts,
    dest: './build/fonts',
  };

  var serverOpt = {
    root: './build',
    port: 8889,
    livereload: true,
  };

  connect.server(serverOpt);

  gulp.watch(Array.prototype.concat(files.js, files.css),
    function () {
      cssTask(cssOpt);
      jsTask(jsOpt);
    }
  );

  return merge(
    browserifyDepsTask(browserifyDepsOpt),
    browserifyTask(browserifyOpt),
    cssTask(cssOpt),
    jsTask(jsOpt),
    fontsTask(fontsOpt)
  );

});
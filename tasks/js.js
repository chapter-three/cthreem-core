const babel      = require('gulp-babel');
const concat     = require('gulp-concat');
const del        = require('del');
const error      = require('./core').error;
const eslint     = require('gulp-eslint');
const gulpif     = require('gulp-if');
const plumber    = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const uglify     = require('gulp-uglify');

let gulp = null;
let config = {};
let tasks = [];
let browserSync = null;

/**
 * Compile
 */
function jsCompile() {
  return gulp.src(config.src)
    .pipe(plumber({ errorHandler: error }))
    .pipe(sourcemaps.init())
    .pipe(gulpif(config.babel, babel()))
    .pipe(gulpif(config.uglify, uglify()))
    .pipe(gulpif(config.concat.enabled, concat(config.concat.dest)))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.dest));
}
jsCompile.description = 'Compile, transpile, and uglify javascript.';

/**
 * Clean
 */
function jsClean() {
  return del([
    config.dest
  ], { force: true });
}
jsClean.description = 'Delete compiled javascript files.';

/**
 * Validate
 */
function jsValidate() {
  return gulp.src(config.src)
    .pipe(plumber({ errorHandler: error }))
    .pipe(eslint())
    .pipe(eslint.format());
}
jsValidate.description = 'Validate (lint) javascript for errors.';

/**
 * Reload
 */
function jsReload(done) {
  if (browserSync) {
    browserSync.reload();
  }
  done();
}
jsReload.description = 'Reload browsers.';

/**
 * Watch
 */
function jsWatch() {
  const watchTasks = [jsCompile];

  if (config.lint) {
    watchTasks.push(jsValidate);
  }

  return gulp.watch(config.src, gulp.series(gulp.parallel(watchTasks, jsReload)));
}
jsWatch.description = 'Watch javascript files for changes.';


module.exports = (options) => {
  gulp = options.gulp;
  config = options.config;
  tasks = options.tasks;
  browserSync = options.browserSync;

  gulp.task('compile:js', jsCompile);
  tasks.compile.push('compile:js');

  gulp.task('clean:js', jsClean);
  tasks.clean.push('clean:js');

  if (config.lint) {
    gulp.task('validate:js', jsValidate);
    tasks.validate.push('validate:js');
  }

  gulp.task('watch:js', jsWatch);
  tasks.watch.push('watch:js');
}

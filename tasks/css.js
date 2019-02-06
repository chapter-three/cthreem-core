const del        = require('del');
const error      = require('./core').error;
const flatten    = require('gulp-flatten');
const glob       = require('gulp-sass-glob');
const gulpif     = require('gulp-if');
const plumber    = require('gulp-plumber');
const prefix     = require('gulp-autoprefixer');
const sass       = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const strip      = require('gulp-strip-comments');
const stylelint  = require('gulp-stylelint');

let gulp = null;
let config = {};
let tasks = [];
let browserSync = null;

/**
 * Compile
 */
function cssCompile() {
  return gulp.src(config.src)
    .pipe(glob())
    .pipe(plumber({ errorHandler: error }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: config.outputStyle,
      includePaths: config.includePaths
    }))
    .pipe(prefix(config.autoPrefixer))
    .pipe(gulpif(config.removeSourceComments, strip.text()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulpif(config.flattenDest, flatten()))
    .pipe(gulp.dest(config.dest));
}
cssCompile.description = 'Compile scss to css using libsass, sourcemaps, and autoprefixer.';

/**
 * Clean
 */
function cssClean() {
  return del([
    config.dest
  ], { force: true });
}
cssClean.description = 'Delete compiled css files.';

/**
 * Validate
 */
function cssValidate() {
  return gulp.src(config.src)
    .pipe(plumber({ errorHandler: error }))
    .pipe(stylelint({
      failAfterError: false,
      reporters: [{
        formatter: 'string', console: true
      }]
    }));
}
cssValidate.description = 'Validate (lint) scss for errors.';

/**
 * Reload
 */
function cssReload(done) {
  if (browserSync) {
    browserSync.reload();
  }
  done();
}
cssReload.description = 'Reload browsers.';

/**
 * Watch
 */
function cssWatch() {
  const watchTasks = [cssCompile];

  if (config.lint) {
    watchTasks.push(cssValidate);
  }

  return gulp.watch(config.src, gulp.series(gulp.parallel(watchTasks), cssReload));
}
cssWatch.description = 'Watch scss files for changes.';


module.exports = (options) => {
  gulp = options.gulp;
  config = options.config;
  tasks = options.tasks;
  browserSync = options.browserSync;

  gulp.task('compile:css', cssCompile);
  tasks.compile.push('compile:css');

  gulp.task('clean:css', cssClean);
  tasks.clean.push('clean:css');

  if (config.lint) {
    gulp.task('validate:css', cssValidate);
    tasks.validate.push('validate:css');
  }

  gulp.task('watch:css', cssWatch);
  tasks.watch.push('watch:css');
}

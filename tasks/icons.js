const del      = require('del');
const error    = require('./core').error;
const plumber  = require('gulp-plumber');
const rename   = require('gulp-rename');
const svgmin   = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');

let gulp = null;
let config = {};
let tasks = [];
let browserSync = null;

/**
 * Compile
 */
function iconCompile() {
  return gulp.src(config.src)
    .pipe(plumber({ errorHandler: error }))
    .pipe(svgmin())
    .pipe(rename({ prefix: 'icon-' }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename(config.destName))
    .pipe(rename(function (path) {
      path.dirname = '';
      return path;
    }))
    .pipe(gulp.dest(config.dest));
}
iconCompile.description = 'Compile svg icons into an SVG sprite.';

/**
 * Clean
 */
function iconClean() {
  return del([
    config.dest
  ], { force: true });
}
iconClean.description = 'Delete compiled icon files.';

/**
 * Reload
 */
function iconReload(done) {
  if (browserSync) {
    browserSync.reload();
  }
  done();
}
iconReload.description = 'Reload browsers.';

/**
 * Watch
 */
function iconWatch() {
  const watchTasks = [iconCompile];

  return gulp.watch(config.src, gulp.series(gulp.parallel(watchTasks), iconReload));
}
iconWatch.description = 'Watch icon files for changes.';


module.exports = (options) => {
  gulp = options.gulp;
  config = options.config;
  tasks = options.tasks;
  browserSync = options.browserSync;

  gulp.task('compile:icon', iconCompile);
  tasks.compile.push('compile:icon');

  gulp.task('clean:icon', iconClean);
  tasks.clean.push('clean:icon');

  gulp.task('watch:icon', iconWatch);
  tasks.watch.push('watch:icon');
}

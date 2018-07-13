const del      = require('del');
const error    = require('./core').error;
const flatten  = require('gulp-flatten');
const gulpif   = require('gulp-if');
const imagemin = require('gulp-imagemin');
const plumber  = require('gulp-plumber');

let gulp = null;
let config = {};
let tasks = [];
let browserSync = null;

function imageCompress() {
  return gulp.src(config.src)
    .pipe(plumber({ errorHandler: error }))
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.jpegtran({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: false },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulpif(config.flattenDest, flatten()))
    .pipe(gulp.dest(config.dest));
}
imageCompress.description = 'Compress images.';

/**
 * Clean
 */
function imageClean() {
  return del([
    config.dest
  ], { force: true });
}
imageClean.description = 'Delete optimized image files.';

/**
 * Reload
 */
function imageReload(done) {
  if (browserSync) {
    browserSync.reload();
  }
  done();
}
imageReload.description = 'Reload browsers.';

/**
 * Watch
 */
function imageWatch() {
  const watchTasks = [imageCompress];

  return gulp.watch(config.src, gulp.series(gulp.parallel(watchTasks), imageReload));
}
imageWatch.description = 'Watch image files for changes.';


module.exports = (options) => {
  gulp = options.gulp;
  config = options.config;
  tasks = options.tasks;
  browserSync = options.browserSync;

  gulp.task('compress:image', imageCompress);
  tasks.compress.push('compress:image');

  gulp.task('clean:image', imageClean);
  tasks.clean.push('clean:image');

  gulp.task('watch:image', imageWatch);
  tasks.watch.push('watch:image');
}

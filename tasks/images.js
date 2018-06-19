const del      = require('del');
const error    = require('./core').error;
const flatten  = require('gulp-flatten');
const gulpif   = require('gulp-if');
const imagemin = require('gulp-imagemin');
const plumber  = require('gulp-plumber');

module.exports = (gulp, config, tasks) => {
  function imageCompress(done) {
    return gulp.src(config.images.src)
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
      .pipe(gulpif(config.images.flattenDest, flatten()))
      .pipe(gulp.dest(config.images.dest))
      .on('end', () => {
        done();
      });
  }
  imageCompress.description = 'Compress images.';

  /**
   * Clean
   */
  function imageClean(done) {
    del([
      config.images.dest
    ], { force: true }).then(() => {
      done();
    });
  }
  imageClean.description = 'Delete optimized image files.';

  /**
   * Watch
   */
  function imageWatch() {
    const watchTasks = [imageCompress];

    return gulp.watch(config.images.src, gulp.parallel(watchTasks));
  }
  imageWatch.description = 'Watch image files for changes.'


  /**
   * Setup gulp tasks.
   */

  gulp.task('compress:image', imageCompress);
  tasks.compress.push('compress:image');

  gulp.task('clean:image', imageClean);
  tasks.clean.push('clean:image');

  gulp.task('watch:image', imageWatch);
  tasks.watch.push('watch:image');
}

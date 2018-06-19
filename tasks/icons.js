const del      = require('del');
const error    = require('./core').error;
const plumber  = require('gulp-plumber');
const rename   = require('gulp-rename');
const svgmin   = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');



module.exports = (gulp, config, tasks) => {
  /**
   * Compile
   */
  function iconCompile(done) {
    gulp.src(config.icons.src)
      .pipe(plumber({ errorHandler: error }))
      .pipe(svgmin())
      .pipe(rename({ prefix: 'icon-' }))
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(rename(config.icons.destName))
      .pipe(rename(function (path) {
        path.dirname = '';
        return path;
      }))
      .pipe(gulp.dest(config.icons.dest))
      .on('end', () => {
        done();
      });
  }
  iconCompile.description = 'Compile svg icons into an SVG sprite.';

  /**
   * Clean
   */
  function iconClean(done) {
    del([
      config.icons.dest
    ], { force: true }).then(() => {
      done();
    });
  }
  iconClean.description = 'Delete compiled icon files.';

  /**
   * Watch
   */
  function iconWatch() {
    const watchTasks = [iconCompile];

    return gulp.watch(config.icons.src, gulp.parallel(watchTasks));
  }
  iconWatch.description = 'Watch icon files for changes.'


  /**
   * Setup gulp tasks.
   */

  gulp.task('compile:icon', iconCompile);
  tasks.compile.push('compile:icon');

  gulp.task('clean:icon', iconClean);
  tasks.clean.push('clean:icon');

  gulp.task('watch:icon', iconWatch);
  tasks.watch.push('watch:icon');
}

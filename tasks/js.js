const babel      = require('gulp-babel');
const concat     = require('gulp-concat');
const del        = require('del');
const error      = require('./core').error;
const eslint     = require('gulp-eslint');
const gulpif     = require('gulp-if');
const plumber    = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const uglify     = require('gulp-uglify');


module.exports = (gulp, config, tasks, browserSync) => {
  /**
   * Compile
   */
  function jsCompile(done) {
    gulp.src(config.js.src)
      .pipe(plumber({ errorHandler: error }))
      .pipe(sourcemaps.init())
      .pipe(gulpif(config.js.babel, babel()))
      .pipe(gulpif(config.js.uglify, uglify()))
      .pipe(gulpif(config.js.concat.enabled, concat(config.js.concat.dest)))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.js.dest))
      .on('end', () => {
        done();
      });
  }
  jsCompile.description = 'Compile, transpile, and uglify javascript.';

  /**
   * Clean
   */
  function jsClean(done) {
    del([
      config.js.dest
    ], { force: true }).then(() => {
      done();
    });
  }
  jsClean.description = 'Delete compiled javascript files.';

  /**
   * Validate
   */
  function jsValidate() {
    return gulp.src(config.js.src)
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

    if (config.js.lint) {
      watchTasks.push(jsValidate);
    }

    return gulp.watch(config.js.src, gulp.series(gulp.parallel(watchTasks, jsReload)));
  }
  jsWatch.description = 'Watch javascript files for changes.';


  /**
   * Setup gulp tasks.
   */

  gulp.task('compile:js', jsCompile);
  tasks.compile.push('compile:js');

  gulp.task('clean:js', jsClean);
  tasks.clean.push('clean:js');

  if (config.js.lint) {
    gulp.task('validate:js', jsValidate);
    tasks.validate.push('validate:js');
  }

  gulp.task('watch:js', jsWatch);
  tasks.watch.push('watch:js');
}

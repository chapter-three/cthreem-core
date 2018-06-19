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


module.exports = (gulp, config, tasks) => {
  /**
   * Compile
   */
  function cssCompile(done) {
    gulp.src(config.css.src)
      .pipe(glob())
      .pipe(plumber({ errorHandler: error }))
      .pipe(sourcemaps.init())
      .pipe(sass({
        outputStyle: config.css.outputStyle,
        includePaths: config.css.includePaths
      }))
      .pipe(prefix({
        browsers: config.css.autoPrefixerBrowsers
      }))
      .pipe(gulpif(config.css.removeSourceComments, strip.text()))
      .pipe(sourcemaps.write('./'))
      .pipe(gulpif(config.css.flattenDest, flatten()))
      .pipe(gulp.dest(config.css.dest))
      .on('end', () => {
        done();
      });
  }
  cssCompile.description = 'Compile scss to css using libsass, sourcemaps, and autoprefixer.';

  /**
   * Clean
   */
  function cssClean(done) {
    del([
      config.css.dest
    ], { force: true }).then(() => {
      done();
    });
  }
  cssClean.description = 'Delete compiled css files.';

  /**
   * Validate
   */
  function cssValidate(done) {
    gulp.src(config.css.src)
      .pipe(plumber({ errorHandler: error }))
      .pipe(stylelint({
        failAfterError: false,
        reporters: [{
          formatter: 'string', console: true
        }]
      }))
      .on('end', () => {
        done();
      });
  }
  cssValidate.description = 'Validate (lint) scss for errors.'

  /**
   * Watch
   */
  function cssWatch() {
    const watchTasks = [cssCompile];

    if (config.css.lint) {
      watchTasks.push(cssValidate);
    }

    return gulp.watch(config.css.src, gulp.parallel(watchTasks));
  }
  cssWatch.description = 'Watch scss files for changes.'


  /**
   * Setup gulp tasks.
   */

  gulp.task('compile:css', cssCompile);
  tasks.compile.push('compile:css');

  gulp.task('clean:css', cssClean);
  tasks.clean.push('clean:css');

  if (config.css.lint) {
    gulp.task('validate:css', cssValidate);
    tasks.validate.push('validate:css');
  }

  gulp.task('watch:css', cssWatch);
  tasks.watch.push('watch:css');
}

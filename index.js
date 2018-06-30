'use strict'

const _             = require('lodash');
const defaultConfig = require('./gulp-config');

module.exports = (gulp, userConfig) => {
  const config = _.merge(defaultConfig, userConfig);

  const tasks = {
    clean: [],
    compile: [],
    compress: [],
    default: [],
    validate: [],
    watch: [],
  };

  /**
   * Add individual task items to each "tasks" set.
   * These are in a specific order since some tasks need to be run prior to others.
   */

  let browserSync = null;
  if (config.browserSync.enabled) {
    browserSync = require('./tasks/browser-sync')(config);
  }

  if (config.icons.enabled) {
    require('./tasks/icons')(gulp, config, tasks, browserSync);
  }

  if (config.css.enabled) {
    require('./tasks/css')(gulp, config, tasks, browserSync);
  }

  if (config.js.enabled) {
    require('./tasks/js')(gulp, config, tasks, browserSync);
  }

  if (config.images.enabled) {
    require('./tasks/images')(gulp, config, tasks, browserSync);
  }

  if (config.patternLab.enabled) {
    require('./tasks/pattern-lab')(gulp, config, tasks, browserSync);
  }

  /**
   * Gulp tasks.
   */

  gulp.task('clean', tasks.clean.length ? gulp.parallel(tasks.clean) : (done) => { done() });
  gulp.task('compile', tasks.compile.length ? gulp.series(tasks.compile) : (done) => { done() });
  gulp.task('compress', tasks.compress.length ? gulp.parallel(tasks.compress) : (done) => { done() });
  gulp.task('validate', tasks.validate.length ? gulp.parallel(tasks.validate) : (done) => { done() });
  gulp.task('watch', tasks.watch.length ? gulp.parallel(tasks.watch) : (done) => { done() });

  gulp.task('default', gulp.series([
    'clean',
    gulp.parallel([
      'validate',
      'compress',
      'compile'
    ]),
    'watch'
  ]));
};

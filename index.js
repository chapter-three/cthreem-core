'use strict'

const _             = require('lodash');
const defaultConfig = require('./gulp-config');

module.exports = (gulp, userConfig) => {
  const config = _.merge(defaultConfig, userConfig);

  const tasks = {
    clean: [],
    compile: [],
    default: [],
    validate: [],
    watch: [],
  };

  /**
   * Add individual task items to each "tasks" set.
   * These are in a specific order since some tasks need to be run prior to others.
   */

  if (config.css.enabled) {
    require('./tasks/css')(gulp, config, tasks);
  }

  if (config.js.enabled) {
    require('./tasks/js')(gulp, config, tasks);
  }

  if (config.browserSync.enabled) {
    require('./tasks/browser-sync')(gulp, config, tasks);
  }

  /**
   * Gulp tasks.
   */

  gulp.task('clean', tasks.clean.length ? gulp.parallel(tasks.clean) : () => {});
  gulp.task('compile', tasks.compile.length ? gulp.series(tasks.compile) : () => {});
  gulp.task('validate', tasks.validate.length ? gulp.parallel(tasks.validate) : () => {});
  gulp.task('watch', tasks.watch.length ? gulp.parallel(tasks.watch) : () => {});

  gulp.task('default', gulp.series([
    'clean',
    gulp.parallel([
      'validate',
      'compile'
    ]),
    'watch'
  ]));
};

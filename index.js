'use strict'

const _ = require('lodash');
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

  /**
   * Gulp tasks.
   */

  gulp.task('clean', gulp.parallel(tasks.clean));
  gulp.task('compile', gulp.series(tasks.compile));
  gulp.task('validate', gulp.parallel(tasks.validate));
  gulp.task('watch', gulp.parallel(tasks.watch));

  gulp.task('default', gulp.series([
    'clean',
    gulp.parallel([
      'validate',
      'compile'
    ]),
    'watch'
  ]));
};

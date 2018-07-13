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

  let browserSync = null;
  if (config.browserSync.enabled) {
    browserSync = require('./tasks/browser-sync')(config);
  }

  Object.keys(config.tasks).forEach((task) => {
    if (!config.tasks[task].enabled) {
      return;
    }

    const options = {
      gulp: gulp,
      config: config.tasks[task],
      tasks: tasks,
      browserSync: browserSync
    }

    if (config.tasks[task].type == 'plugin') {
      require(`../${config.tasks[task].name}`)(options);
    }
    else {
      require(`./tasks/${task}.js`)(options);
    }
  });


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

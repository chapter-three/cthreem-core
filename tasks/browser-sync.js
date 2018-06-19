const _           = require('lodash');
const browserSync = require('browser-sync').create();

module.exports = (gulp, config, tasks) => {
  let files = [];
  if (config.browserSync.files.css) {
    files.push(config.css.dest + '/**/*.css');
  }
  if (config.browserSync.files.js) {
    files.push(config.js.dest + '/**/*.js');
  }
  if (config.browserSync.files.icons) {
    files.push(config.icons.dest + '/**/*.svg');
  }
  if (config.browserSync.files.extra) {
    config.browserSync.files.extra.forEach((file) => {
      files.push(file);
    });
  }

  // See https://browsersync.io/docs/options
  const options = {
    ui: config.browserSync.ui,
    files: files,
    notify: false,
    open: config.browserSync.startupBehavior,
    reloadOnRestart: true,
    reloadDelay: 100,
  }

  if (config.browserSync.domain) {
    _.merge(options, {
      proxy: config.browserSync.domain
    });
  }
  else {
    _.merge(options, {
      server: {
        baseDir: config.browserSync.baseDir,
      },
      startPath: config.browserSync.startPath
    });
  }

  function bsStart() {
    browserSync.init(options);
  }
  bsStart.description = 'Watch files to reload browser when needed.';


  /**
   * Setup gulp tasks.
   */

  if (config.browserSync.enabled) {
    gulp.task('watch:bs', bsStart);
    tasks.watch.push('watch:bs');
  }
}

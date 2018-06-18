const browserSync = require('browser-sync').create();

module.exports = (gulp, config, tasks) => {
  let files = [];
  if (config.browserSync.files.css) {
    files.push(config.css.dest + '/**/*.css');
  }
  if (config.browserSync.files.js) {
    files.push(config.js.dest + '/**/*.js');
  }
  if (config.browserSync.files.extra) {
    config.browserSync.files.extra.forEach((file) => {
      files.push(file);
    });
  }

  const options = {
    ui: config.browserSync.ui,
    files: files,
    open: config.browserSync.startupBehavior
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

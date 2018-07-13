const del      = require('del');
const path     = require('path');
const sh        = require('./core').sh;
const scssvars = require('patternlab-scssvariables');

let gulp = null;
let config = {};
let tasks = [];
let browserSync = null;

let consolePath = '';
let publicPath = '';
let sourcePath = '';


/**
 * Generate
 */
function plGenerate(done) {
  sh(`php ${consolePath} --generate`, done);
}
plGenerate.description = 'Generate/build Pattern Lab.';

/**
 * SCSS to YAML
 */
function plScssToYml(done) {
  config.scssToYml.forEach(({ scss, yml, text }) => {
    scssvars({
      src: scss,
      dest: yml,
      description: `To add to these items, edit the file at <code>${scss}</code>`
    });
  });
  done();
}
plScssToYml.description = 'Generate yml files from scss variables.';

/**
 * Clean
 */
function plClean() {
  return del([
    publicPath
  ], { force: true });
}
plClean.description = 'Delete compiled Pattern Lab files.';

/**
 * Reload
 */
function plReload(done) {
  if (browserSync) {
    browserSync.reload();
  }
  done();
}
plReload.description = 'Reload browsers.';

/**
 * Watch scss to yml
 */
function plScssToYmlWatch() {
  const watchTasks = [plScssToYml];
  const plSrc = [];
  config.scssToYml.forEach(({ scss, yml }) => {
    plSrc.push(scss);
  });

  return gulp.watch(plSrc, gulp.series(watchTasks, plReload));
}
plScssToYmlWatch.description = 'Watch Pattern Lab files for changes.';

/**
 * Watch generate
 */
function plGenerateWatch() {
  const watchTasks = [plGenerate];
  const plSrc = path.join(sourcePath, `**/*.{${config.watchedExtensions}}`);

  return gulp.watch(plSrc, gulp.series(gulp.parallel(watchTasks), plReload));
}
plGenerateWatch.description = 'Watch Pattern Lab files for changes.';


module.exports = (options) => {
  gulp = options.gulp;
  config = options.config;
  tasks = options.tasks;
  browserSync = options.browserSync;

  consolePath = path.join(config.basePath, 'core/console');
  publicPath = path.join(config.basePath, 'public');
  sourcePath = path.join(config.basePath, 'source');

  gulp.task('compile:pl:scsstoyml', plScssToYml);
  tasks.compile.push('compile:pl:scsstoyml');

  gulp.task('compile:pl:generate', plGenerate);
  tasks.compile.push('compile:pl:generate');

  gulp.task('clean:pl', plClean);
  tasks.clean.push('clean:pl');

  gulp.task('watch:pl:scsstoyml', plScssToYmlWatch);
  tasks.watch.push('watch:pl:scsstoyml');

  gulp.task('watch:pl:generate', plGenerateWatch);
  tasks.watch.push('watch:pl:generate');
}

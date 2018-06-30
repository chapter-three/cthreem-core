const _           = require('lodash');
const browserSync = require('browser-sync').create();

function init(config) {
  // See https://browsersync.io/docs/options
  const options = {
    ui: config.browserSync.ui,
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

  browserSync.init(options);

  return browserSync;
}

module.exports = (config) => {
  return init(config);
}

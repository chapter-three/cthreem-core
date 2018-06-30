const exec   = require('child_process').exec;
const notifier = require('node-notifier');
const notify = require('gulp-notify');


/**
 * Error handler.
 */
function error(err) {
  notify.onError({
    title:    "Gulp",
    subtitle: "Failure!",
    message:  "Error: <%= error.message %>",
    sound:    "Beep"
  })(err);
  this.emit('end');
};

/**
 * Run shell script
 */
function sh(cmd, cb) {
  exec(cmd, (error, stdout, stderror) => {
    if (error) {
      notifier.notify({
        title: cmd,
        subtitle: "Failure!",
        message: `exec error: ${error}`,
        sound: "Beep"
      });
      console.error(`exec error: ${stdout}`);
      return;
    }
  });
  cb();
}

module.exports = {
  error,
  sh
}

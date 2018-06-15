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


module.exports = {
  error
}

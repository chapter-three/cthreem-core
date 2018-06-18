module.exports = {
  css: {
    enabled: true,
    src: [
      'scss/**/*.scss'
    ],
    dest: './assets/css',
    outputStyle: 'nested',
    includePaths: [],
    autoPrefixerBrowsers: [
      'last 2 versions',
      '>= 1%',
      'ie >= 11'
    ],
    removeSourceComments: true,
    flattenDest: true,
    lint: true,
  },
  js: {
    enabled: true,
    src: [
      'js/**/*.js'
    ],
    dest: './assets/js',
    concat: {
      enabled: true,
      dest: 'all.js'
    },
    babel: true,
    uglify: false,
    lint: true
  },
  images: {
    enabled: true,
    src: [
      'images/**/*{.png,.gif,.jpg,.jpeg,.svg}'
    ],
    dest: './assets/images',
    flattenDest: false
  },
  browserSync: {
    enabled: true,
    files: {
      css: true,
      js: true,
      extra: []
    },
    baseDir: './',
    startPath: '',
    domain: '',
    startupBehavior: false,
    ui: false,
  }
};

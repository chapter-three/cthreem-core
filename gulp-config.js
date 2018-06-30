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
  icons: {
    enabled: true,
    src: [
      'icons/**/*.svg'
    ],
    dest: './assets/images',
    destName: 'icons.svg'
  },
  browserSync: {
    enabled: true,
    baseDir: './',
    startPath: '',
    domain: '',
    startupBehavior: false,
    ui: false,
  }
};

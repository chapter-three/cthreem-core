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
};

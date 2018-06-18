[![NPM](https://nodei.co/npm/cthreem-core.png)](https://nodei.co/npm/cthreem-core/)

# CThreem Core

Build tools for Drupal themes.

## Installation

```bash
npm install cthreem-core --save
# -- or --
yarn add cthreem-core
```

Create a `gulpfile.js` and (optionally) a `gulp-config.js`:

```bash
cp node_modules/cthreem-core/examples/gulpfile.js gulpfile.js
cp node_modules/cthreem-core/gulp-config.js gulp-config.js
```

Edit the above `gulp-config.js` file as needed.

Create config files:

```bash
cp node_modules/cthreem-core/examples/.babelrc .babelrc
cp node_modules/cthreem-core/examples/.eslintrc.js .eslintrc.js
cp node_modules/cthreem-core/examples/.stylelintrc .stylelintrc
```

## Usage

If you are running `Gulp` v4 globally, then you can just use gulp. 

```bash
gulp compile
# -- or --
gulp watch
# -- or --
gulp
```

To see available tasks:

```bash
gulp --tasks
```

If you are *not* running `Gulp` v4 globally, then you need to create one or more npm [run scripts](https://docs.npmjs.com/cli/run-script). Add the following to your `package.json`:

```json
{
  ...
  "scripts": {
    "compile": "gulp compile",
    "start": "gulp default",
    "gulp": "gulp"
  },
  ...
}
```

Now you can use gulp through `npm run`:

```bash
npm run start
# -- or --
npm run gulp
# -- or --
npm run gulp -- --tasks
```


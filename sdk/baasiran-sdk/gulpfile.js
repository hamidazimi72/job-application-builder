const babel      = require('gulp-babel');
const browserify = require('browserify');
const derequire  = require('gulp-derequire');
const gulp       = require('gulp');
const insert     = require('gulp-insert');
const path       = require('path');
const rename     = require('gulp-rename');
const source     = require('vinyl-source-stream');
const uglify     = require('gulp-uglify');
const watch      = require('gulp-watch');

const BUILD = process.env.BAASIRAN_BUILD || 'browser';
const VERSION = '1.0.0'

const transformRuntime = ["@babel/plugin-transform-runtime", {
  "corejs": 3,
  "helpers": true,
  "regenerator": true,
  "useESModules": false
}];

const PRESETS = {
  'browser': ["@babel/preset-typescript", ["@babel/preset-env", {
    "targets": "> 0.25%, not dead"
  }]],
  'weapp': ["@babel/preset-typescript", ["@babel/preset-env", {
    "targets": "> 0.25%, not dead"
  }], '@babel/react'],
  'node': ["@babel/preset-typescript", ["@babel/preset-env", {
    "targets": { "node": "14" }
  }]],
  'react-native': ["@babel/preset-typescript", 'module:metro-react-native-babel-preset'],
};
const PLUGINS = {
  'browser': [transformRuntime, '@babel/plugin-proposal-class-properties', 'inline-package-json',
    ['transform-inline-environment-variables', {'exclude': ['SERVER_RENDERING']}]],
  'weapp': [transformRuntime, '@babel/plugin-proposal-class-properties', 'inline-package-json',
    ['transform-inline-environment-variables', {'exclude': ['SERVER_RENDERING']}]],
  'node': ['inline-package-json', 'transform-inline-environment-variables'],
  'react-native': ['inline-package-json', 'transform-inline-environment-variables']
};

const DEV_HEADER = (
  '/**\n' +
  ' * Baasiran JavaScript SDK v' + VERSION + '\n' +
  ' */\n'
);

const FULL_HEADER = (
  '/**\n' +
  ' * Baasiran JavaScript SDK v' + VERSION + '\n' +
  ' */\n'
);

function compileTask(stream) {
  return stream
    .pipe(babel({
      presets: PRESETS[BUILD],
      plugins: PLUGINS[BUILD],
    }))
    // Second pass to kill BUILD-switched code
    .pipe(babel({
      plugins: ['minify-dead-code-elimination'],
    }))
    .pipe(gulp.dest(path.join('lib', BUILD)));
}

gulp.task('compile', function() {
  return compileTask(gulp.src('src/*.*(js|ts)'));
});

gulp.task('browserify', function(cb) {
  const stream = browserify({
    builtins: ['_process', 'events'],
    entries: 'lib/browser/Baasiran.js',
    standalone: 'Baasiran'
  })
    .exclude('xmlhttprequest')
    .ignore('_process')
    .bundle();
  stream.on('end', () => {
    cb();
  });
  return stream.pipe(source('baasiran.js'))
    .pipe(derequire())
    .pipe(insert.prepend(DEV_HEADER))
    .pipe(gulp.dest('./dist'));
});


gulp.task('browserify-weapp', function(cb) {
  const stream = browserify({
    builtins: ['_process', 'events'],
    entries: 'lib/weapp/Baasiran.js',
    standalone: 'Baasiran'
  })
    .exclude('xmlhttprequest')
    .ignore('_process')
    .bundle();
  stream.on('end', () => {
    cb();
  });
  return stream.pipe(source('baasiran.weapp.js'))
    .pipe(derequire())
    .pipe(insert.prepend(DEV_HEADER))
    .pipe(gulp.dest('./dist'));
});

gulp.task('minify', function() {
  return gulp.src('dist/baasiran.js')
    .pipe(uglify())
    .pipe(insert.prepend(FULL_HEADER))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('minify-weapp', function() {
  return gulp.src('dist/baasiran.weapp.js')
    .pipe(uglify())
    .pipe(insert.prepend(FULL_HEADER))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest('./dist'))
});

gulp.task('watch', function() {
  if (BUILD === 'browser') {
    const watcher = gulp.watch('src/*.*(js|ts)', { ignoreInitial: false }, gulp.series('compile', 'browserify', 'minify'));
    watcher.on('add', function(path) {
      console.log(`File ${path} was added`);
    });
    watcher.on('change', function(path) {
      console.log(`File ${path} was changed`);
    });
    return watcher;
  }
  return compileTask(watch('src/*.*(js|ts)', { ignoreInitial: false, verbose: true }));
});

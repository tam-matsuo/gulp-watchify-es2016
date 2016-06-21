import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
const $ = gulpLoadPlugins();

function bundle(watching = false) {
  // `src/scripts/main.js` を `assets/scripts.js` にビルド
  const b = browserify({
    entries: ['src/scripts/main.js'],
    transform: ['babelify'],
    debug: true,
    plugin: (watching) ? [watchify] : null
  })
  .on('update', () => {
    bundler();
    console.log('scripts rebuild');
  });

  function bundler() {
    return b.bundle()
      .on('error', (err) => {
        console.log(err.message);
      })
      .pipe(source('scripts.js'))
      .pipe(buffer())
      .pipe($.sourcemaps.init({loadMaps: true}))
      .pipe($.uglify())
      .pipe($.sourcemaps.write('./'))
      .pipe(gulp.dest('assets/'));
  }

  return bundler();
}

gulp.task('scripts', () => {
  bundle();
});

gulp.task('styles', () => {
  // `src/styles/**.scss` を `assets/` にビルド
  gulp.src(`src/styles/**/*.scss`)
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('assets'))
});

gulp.task('build', ['scripts', 'styles']);

gulp.task('watch', () => {
  bundle(true);
  gulp.watch('src/styles/**/*.scss', ['styles']);
});

gulp.task('serve', ['watch'], () => {
  browserSync({
    notify: false,
    port: 9000,
    // proxy: 'example.com',
    server: {
      baseDir: '.'
    }
  });

  gulp.watch([
    '**/*.html',
    '**/*.php',
    'assets/**/*.css',
    'assets/**/*.js'
  ]).on('change', browserSync.reload);
});

gulp.task('default', ['build', 'serve']);

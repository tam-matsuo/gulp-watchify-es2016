import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import watchify from 'watchify';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
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

gulp.task('build', () => {
  bundle();
});

gulp.task('watch', () => {
  bundle(true);
  // その他の watch タスクがあればここに書く (CSSなど)
});

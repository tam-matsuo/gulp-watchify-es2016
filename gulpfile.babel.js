import gulp from 'gulp';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

gulp.task('build', () => {
  // `src/scripts/main.js` を `assets/scripts.js` にビルド
  browserify({
    entries: ['src/scripts/main.js'],
    transform: ['babelify']
  })
  .bundle()
  .pipe(source('scripts.js'))
  .pipe(gulp.dest('assets/'));
});

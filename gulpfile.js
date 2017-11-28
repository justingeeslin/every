var gulp = require('gulp');
gulp.shell = require('gulp-shell');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var gutil = require('gulp-util');

gulp.task('js', function () {
  // set up the browserify instance on a task basis
  var b = browserify({
    entries: './index.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .on('error', gutil.log)
    .pipe(gulp.dest('./dist/'));
});

gulp.task('css', function () {
	return gulp.src([
		'css/*.scss',
	])
		.pipe(sass())
    .pipe(rename(function(path) {
			path.extname = '.css';
		}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('md', function () {
  var markdown = require('gulp-markdown');

  return gulp.src('markdown/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('html'));
})

gulp.task('html', function () {
    'use strict';
    var twig = require('gulp-twig');
    var tap = require('gulp-tap');
    const path = require('path');

    gulp.src('html/*.html')
      .pipe(tap(function(file) {
        gulp.src('html/index.twig')
          .pipe(twig({
            data: {
              htmlInclude: path.basename(file.path),
            }
          }))
          .pipe(rename(path.basename(file.path)))
          .pipe(gulp.dest('dist/'));
      }));
});

gulp.task('servers', gulp.shell.task([
    'php -S 0.0.0.0:9081'
]))

gulp.task('watch', function() {
  gulp.watch('js/*.js', ['js']);
  gulp.watch('index.js', ['js']);
  gulp.watch('css/*.scss', ['css']);
  gulp.watch('html/*.twig', ['html']);

  gulp.watch('markdown/*.md', ['md']);
  gulp.watch('html/*.html', ['html']);

});

gulp.task('default', ['js', 'watch', 'css', 'html'])

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
    .pipe(gulp.dest('./docs/'));
});

gulp.task('css', function () {
	return gulp.src([
		'css/*.scss',
	])
		.pipe(sass())
    .pipe(rename(function(path) {
			path.extname = '.css';
		}))
		.pipe(gulp.dest('docs/'));
});

gulp.task('md', function () {
  var markdown = require('gulp-markdown');

  return gulp.src('markdown/*.md')
        .pipe(markdown())
        .pipe(gulp.dest('html'));
})

var posts = [
  /*
  {
    title: "First Post",
    body: "First post is the deepest, baby I know.",
    html: "",
  }
  */
]
gulp.task('blog-collectposts', function () {
  console.log('Collecting posts..')
  var fs = require("fs")
  var tap = require('gulp-tap');
  const path = require('path');

  // Read HTML into object
  return gulp.src('html/*.html')
    .pipe(tap(function(file) {
      fs.readFile(file.path, "utf-8", function(err, _data) {

        posts.push({html: _data});
      })
    }))

});

gulp.task('blog', ['blog-collectposts'], function() {
  console.log('Making blog.twig')
  // Pass object into twig
  var twig = require('gulp-twig');
  gulp.src('html/blog.twig')
    .pipe(twig({
      data: {
        pageTitle: 'Blog',
        posts: posts
      }
    }))
    .pipe(rename("blog.html"))
    .pipe(gulp.dest('docs/'));
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
              pageTitle: 'Page Title',
              htmlInclude: path.basename(file.path),
            }
          }))
          .pipe(rename(path.basename(file.path)))
          .pipe(gulp.dest('docs/'));
      }));
});

gulp.task('servers', gulp.shell.task([
    'php -S 0.0.0.0:9081'
]))

gulp.task('watch', function() {
  gulp.watch('js/*.js', ['js']);
  gulp.watch('index.js', ['js']);
  gulp.watch('css/*.scss', ['css']);
  gulp.watch('html/*.twig', ['html', 'blog']);

  gulp.watch('markdown/*.md', ['md']);
  gulp.watch('html/*.html', ['html', 'blog']);

});

gulp.task('default', ['js', 'watch', 'css', 'md', 'html'])

var gulp = require('gulp');

var lib    = require('bower-files')();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rigger = require('gulp-rigger');

gulp.task('jsBuildForeign', function () {
  gulp.src(lib.ext('js').files)
    .pipe(concat('foreign.js'))
    .pipe(gulp.dest('./src/js/prebuild/'));
});

gulp.task('jsBuildInternal', function () {
  gulp.src('./src/js/internal.js')
	.pipe(rigger())
    .pipe(gulp.dest('src/js/prebuild'));
});

gulp.task('jsBuild', function () {
  gulp.src('./src/js/prebuild/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/js/'));
});

gulp.task('jsMin', function () {
  gulp.src('./src/js/prebuild/*.js')
	.pipe(concat('main.min.js'))
	.pipe(uglify())
    .pipe(gulp.dest('build/js/'));
});

gulp.task('js', ['jsBuildForeign', 'jsBuildInternal','jsBuild','jsMin']);
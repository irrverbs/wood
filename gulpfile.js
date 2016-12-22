var gulp = require('gulp');

var lib    = require('bower-files')();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rigger = require('gulp-rigger');
var wait   = require('gulp-wait');
var browserSync = require("browser-sync");
var sass   = require('gulp-sass');
var prefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-minify-css');
var rimraf = require('rimraf');
var fs     = require('fs');

gulp.task('cleanBuild', function (cb) {
    rimraf('./build/js/', cb);
});

gulp.task('cleanPrebuild', function (cb) {
    rimraf('./src/js/prebuild/', cb);
});

//собираем все сторонние пакеты в foreign.js
gulp.task('jsBuildForeign',['cleanBuild', 'cleanPrebuild'], function () {
	return  gulp.src(lib.ext('js').files)
				.pipe(concat('foreign.js'))
				.pipe(gulp.dest('./src/js/prebuild/'));
});
//инициализация блоков, когда загружена DOM
gulp.task('jsBuildBlocksInitialize',["jsBuildForeign"], function () {
	return  gulp.src('./src/blocks/**/initialize.js')
				.pipe(concat('blocksInitialize.js'))
				.pipe(gulp.dest('./src/js/prebuild'));
});
//собираем блоки в один файл
gulp.task('jsBuildBlocks',['jsBuildBlocksInitialize'], function () {
	 return gulp.src(['./src/blocks/**/*.js', '!./src/blocks/**/initialize.js'])
				.pipe(concat('blocks.js'))
				.pipe(gulp.dest('./src/js/prebuild'));
});
//собираем инициализацию и код блков вместе
gulp.task('jsBuildInternal',['jsBuildBlocks'], function () {
	return gulp.src('./src/js/internal.js')
    //.pipe(wait('1000'))
				.pipe(rigger())
				.pipe(gulp.dest('./src/js/prebuild'));
});
//сборка внешних и внутренних пакетов в один файл
gulp.task('jsBuild',['jsBuildInternal'], function () {
     return gulp.src(['src/js/prebuild/foreign.js','src/js/prebuild/internal.js'])
				.pipe(concat('main.js'))
				.pipe(gulp.dest('./build/js/'));
});
//минимизация
gulp.task('jsMin',['jsBuild'], function () {
	return gulp.src(['./src/js/prebuild/foreign.js','./src/js/prebuild/internal.js'])
			   .pipe(concat('main.min.js'))
			   .pipe(uglify())
			   .pipe(gulp.dest('build/js/'));
});

gulp.task('js', ['jsMin'], function(){
	return  gulp.src('./src/*.html') 
				//.pipe(wait(1000))
				.pipe(browserSync.reload({stream:true}));
	});

gulp.task('html', function () {
   return  gulp.src('./src/*.html') 
			   .pipe(rigger())
               .pipe(gulp.dest('build/'))
		       //.pipe(wait(1000))
		       .pipe(browserSync.reload({stream:true}));
});



gulp.task('css', function () {
    return gulp.src('./src/**/*.scss')
			   .pipe(concat('main.css'))
			   .pipe(sass())
			   .pipe(prefixer())
			   .pipe(cssmin())
			   .pipe(gulp.dest('build/css/'))
			   //.pipe(wait(1000))
			   .pipe(browserSync.reload({stream:true}));
});




var config = {
    server: {
        baseDir: "./build"
    },
    //tunnel: true,
    host: 'localhost',
    port: 8081
};

gulp.task('server',['watch'], function () {
    browserSync(config);
});
/* gulp.task('reload', function () {
	wait(1000);
    browserSync.reload({stream:true});
}); */
gulp.task('watch', function () {
   gulp.watch('./src/blocks/**/*.js', ['js']);
   gulp.watch('./src/**/*.scss', ['css']);   
   gulp.watch('./src/**/*.html', ['html']);   
});
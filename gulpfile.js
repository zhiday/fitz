// Gulp.js configuration

// Dependencies
var gulp 			= require('gulp'), 
	newer 			= require('gulp-newer'),
	imagemin 		= require('gulp-imagemin'),
	htmlclean 		= require('gulp-htmlclean'),
	sass 			= require('gulp-sass'),
	deporder 		= require('gulp-deporder'),
	concat 			= require('gulp-concat'),
	stripdebug 		= require('gulp-strip-debug'),
	uglify 			= require('gulp-uglify'),
	webserver		= require('gulp-webserver');

// Build variables
var devBuild = (process.env.NODE_ENV !== 'production');
var folder = { src: 'src/', build: 'build/' };

// Image processing
gulp.task('images', function(){
	
	var out = folder.build + 'res/images/';

	return gulp.src(folder.src + 'res/images/**/*')
		.pipe(newer(out))
		.pipe(imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest(out));
});

// HTML processing
gulp.task('html', function(){

	var out = folder.build;

	return gulp.src(folder.src + 'index.html')
		.pipe(htmlclean())
		.pipe(gulp.dest(out));
});

// CSS processing
gulp.task('css', function(){
	return gulp.src(folder.src + 'styles/**/*')
		.pipe(gulp.dest(folder.build + 'styles/'));
});

// JS processing
gulp.task('js', function(){

	var jsbuild = gulp.src(folder.src + 'scripts/**/*')
		.pipe(deporder())
		.pipe(concat('index.js'));

	if (!devBuild){
		jsbuild = jsbuild
			.pipe(stripdebug())
			.pipe(uglify());
	}

	return jsbuild.pipe(gulp.dest(folder.build));
});

// Service
gulp.task('serve', function(){
	gulp.src(folder.build)
		.pipe(webserver({
			livereload: true,
			//directoryListing: true,
			open: true
		}));
});

// Tasks automation

gulp.task('watch', function() {
  gulp.watch(folder.src + 'res/images/**/*', gulp.series('images'));
  gulp.watch(folder.src + 'index.html', gulp.series('html'));
  gulp.watch(folder.src + 'scripts/**/*', gulp.series('js'));
  gulp.watch(folder.src + 'styles/**/*', gulp.series('css'));
});

gulp.task('run', gulp.series('html', 'js', 'css', 'images', gulp.parallel('serve', 'watch')));
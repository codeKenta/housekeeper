var gulp           = require('gulp'),
    sass           = require('gulp-sass'),
    concat         = require('gulp-concat'),
    autoprefixer   = require('gulp-autoprefixer'),
    livereload     = require('gulp-livereload');


gulp.task('concatJs', function(){
  return gulp.src(['js/*.js'])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('../public/scripts'))
  .pipe(livereload());
});


gulp.task('styles', function() {
    gulp.src('sass/styles.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('../public/stylesheets'))
        .pipe(livereload());
});

// Ejs
gulp.task('ejs',function(){
    return gulp.src('../views/pages/**/*.ejs')
    .pipe(livereload());
});

//Watch task
gulp.task('default',function() {
    livereload.listen();
    gulp.watch('sass/*.scss',['styles']);
    gulp.watch('js/*.js', ['concatJs']);
    gulp.watch('../views/pages/**/*.ejs', ['ejs']);
});

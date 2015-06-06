var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');
var minifyCss = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('minify-js', function() {
    gulp.src(['app/js/*.js', 'app/external/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat('result.js'))
        .pipe(gulp.dest('app/build'))
        .pipe(livereload());
});

gulp.task('minify-css', function() {
    gulp.src('app/css/main.css')
        .pipe(minifyCss())
        .pipe(autoprefixer())
        .pipe(concat('result.css'))
        .pipe(gulp.dest('app/build'))
        .pipe(livereload());

    gulp.src('app/css/main.ie8.css')
        .pipe(minifyCss())
        .pipe(concat('result.ie8.css'))
        .pipe(gulp.dest('app/build'))
        .pipe(livereload());

    gulp.src('app/css/main.ie9.css')
        .pipe(minifyCss())
        .pipe(concat('result.ie9.css'))
        .pipe(gulp.dest('app/build'))
        .pipe(livereload());
});

gulp.task('default', ['minify-js', 'minify-css']);

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('app/js/*.js', ['minify-js']);
    gulp.watch('app/css/*.css', ['minify-css']);
});
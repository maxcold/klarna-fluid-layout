var gulp = require('gulp');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var livereload = require('gulp-livereload');

gulp.task('minify', function() {
    gulp.src('app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat('result.js'))
        .pipe(gulp.dest('app/build'))
        .pipe(livereload())
});

gulp.task('watch', function() {
    livereload.listen();
    gulp.watch('app/js/*.js', ['minify']);
});
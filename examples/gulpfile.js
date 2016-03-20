var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    gulpRequire = require('../index.js');

gulp.task('require_fail_a', function () {

    return gulp.src('./fail_a/**')
        .pipe(gulpRequire())
        .pipe(concat('fail_a.js'))
        .pipe(gulp.dest('./dest/'));
                                

});

gulp.task('require_fail_b', function () {

    return gulp.src('./fail_b/**')
        .pipe(gulpRequire())
        .pipe(concat('fail_b.js'))
        .pipe(gulp.dest('./dest/'));
                                

});

gulp.task('require_success', function () {

    return gulp.src('./success/**')
        .pipe(gulpRequire())
        .pipe(concat('success.js'))
        .pipe(gulp.dest('./dest/'));
                                

});

import gulp from 'gulp';
const args = require('yargs').argv;
import rename from 'gulp-rename';
const clean = require('gulp-clean');

gulp.task('del', function() {
  return gulp.src('.env', { read: false, allowEmpty: true }).pipe(clean());
});

gulp.task('move', function() {
  return gulp
    .src(['env/' + args.env + '.env'])
    .pipe(rename('.env'))
    .pipe(gulp.dest('./'));
});

gulp.task('set', gulp.series('del', 'move'));

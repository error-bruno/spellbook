var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./app/stylesheets/**/*.scss'],
  angularApp: ['./app/js/app.js'],
  controllers: ['./app/js/controllers/*.js'],
  services: ['./app/js/services/*.js'],
  vendors: ['./app/vendors/ionic/js/ionic.bundle.js']
};

gulp.task('default', ['sass', 'app', 'controllers', 'services', 'vendors']);

gulp.task('sass', function(done) {
  gulp.src(paths.sass)
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/assets/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/assets/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.angularApp, ['app']);
  gulp.watch(paths.controllers, ['controllers']);
  gulp.watch(paths.services, ['services']);
});

gulp.task('app', function() {
  gulp.src(paths.angularApp)
    .pipe(gulp.dest('./www/assets/js/'));
});

gulp.task('controllers', function() {
  gulp.src(paths.controllers)
    .pipe(concat('controllers.js'))
    .pipe(gulp.dest('./www/assets/js/'));
});


gulp.task('services', function() {
  gulp.src(paths.services)
    .pipe(concat('services.js'))
    .pipe(gulp.dest('./www/assets/js/'));
});

gulp.task('vendors', function() {
  gulp.src(paths.vendors)
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest('./www/assets/js/'));

  gulp.src('app/vendors/ionic/css/ionic.css')
    .pipe(gulp.dest('./www/assets/css/'));

  gulp.src('app/vendors/ionic/fonts/**/*.*')
    .pipe(gulp.dest('./www/assets/fonts/'));
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

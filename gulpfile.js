var inject          = require('gulp-inject'),
    gulp 		    = require('gulp'),
    browserify 	    = require('browserify'),
    babelify 	    = require('babelify'),
    source 		    = require('vinyl-source-stream'),
    concat 		    = require('gulp-concat'),
    babel           = require('gulp-babel'),
    minify          = require('gulp-minify');



var jsLibs = [
  './node_modules/jquery/dist/jquery.js',
  './node_modules/react/dist/react-with-addons.js',
  './node_modules/react-dom/dist/react-dom.min.js'
];

var cssLibs = [
  './node_modules/bootstrap/dist/css/bootstrap.css'
];


var paths = {
  pages: './src/pages/**/*.html'
};

gulp.task('libraries', function () {
  gulp.src(jsLibs)
  .pipe(concat('libs.js'))
  .pipe(gulp.dest('./examples/js/'));

  return gulp.src(cssLibs)
  .pipe(gulp.dest('./examples/css/'));
});


gulp.task('build', function () {
    gulp
      .src('./src/index.html')
      .pipe(gulp.dest('./examples/'));

  return browserify({entries: './src/app.jsx', extensions: ['.jsx','.js'], debug: false})
      .transform('babelify', {presets: ['es2015', 'react']})
      .bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('./examples/js/'));
});



gulp.task('release', function() {


    gulp
      .src('./src/react-simplex.js')
      .pipe( babel({presets: ['react', 'es2015']}) )
      .pipe(gulp.dest('./dist/'))
      
    /*gulp
      .src('./dist/react-simplex.js')*/
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest('./dist/'))

});


gulp.task('default', ['build','libraries'], function () {
  gulp.watch(['./src/**/**/*'], ['build']);
});


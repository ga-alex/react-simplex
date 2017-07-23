var gulp 		    = require('gulp'),
    babel           = require('gulp-babel'),
    minify          = require('gulp-minify'),
    rename          = require('gulp-rename'),
    inject          = require('gulp-inject-string');

gulp.task('release', function() {
    
    
    
    gulp
        .src('./src/react-simplex.js')
        .pipe( babel({presets: ['react', 'es2015']}) )
        .pipe(gulp.dest('./dist/'))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest('./dist/'))
    
    gulp
        .src('./src/react-simplex.js')
        .pipe(inject.prepend('import React from "react";\n'))
        .pipe( babel({presets: ['react', 'es2015']}) )
        .pipe(rename('es6.js'))
        .pipe(gulp.dest('./dist/'))
        .pipe(minify({
            ext:{
                src:'.js',
                min:'.min.js'
            }
        }))
        .pipe(gulp.dest('./dist/'));
    
    
});

gulp.task('default', ['release'], function () {
  gulp.watch(['./src/*'], ['release']);
});


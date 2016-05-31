# gulp-depend

This gulp plugin manages dependencies between files and sorts the files due to their dependencies.

## Install

`npm install --save-dev gulp-depend`

## Usage

    var gulp    = require('gulp'),
        depend  = require('gulp-depend'),
        depend  = require('gulp-concat');

    gulp.task('example', function () {
    
        return gulp.src('./js/**/*.js')
            .pipe(depend())
            .pipe(concat('somefile.js'))
            .pipe(gulp.dest('./dest'));
        
    });

All source files containing the `//= require filename` will be topologically sorted and handed over to the next stream (in this case gulp-concat).

## Example

Assuming you have these files:

a.js

b.js -> //= require a.js
c.js -> //= require.a.js

The plugin will pass the input streams in the order a.js b.js c.js to the next stream. No file will be included twice. It also detects unexisting files and circular dependencies.

The require works through different directories. Make sure you do not have duplicate names.

## Licence

Copyright (C) 2016 Stefan Poeter (Stefan.Poeter[at]cloud-automation.de)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

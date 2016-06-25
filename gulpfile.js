// helped from https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md

var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var assign = require('lodash.assign');
var gulpCopy = require('gulp-copy');
var del = require('del');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var htmlReplace = require('gulp-html-replace');
var foreach = require('gulp-foreach');
var concat = require('gulp-concat');
var rename = require("gulp-rename");

var fs = require('fs');
var path = require('path');

gulp.task('clean', function () {
    return del([
        'build/*',
    ]);
});

gulp.task('copy:images', function () {
    gulp.src('images/**/*', { base: '.' })
        .pipe(gulp.dest('build'));
});

gulp.task('copy:css', function () {
    gulp.src('styles/**/*', { base: '.' })
        .pipe(watch('styles/**/*', { base: '.' }))
        .pipe(gulp.dest('build'));

    gulp.src('public/jquery-ui/jquery-ui.css')
        .pipe(concat('styles/editor_handle.css'))
        .pipe(concat('styles/notification.css'))
        .pipe(concat('contents.css'))
        .pipe(gulp.dest('./build/styles'));
});

gulp.task('copy:html', function () {
    gulp.src('html/**/*', { base: '.' })
        .pipe(watch('html/**/*', { base: '.' }))
        .pipe(htmlReplace({
            'react': '/public/react/react.bundle.js'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('copy:others', function () {
    gulp.src(['public/**/*.woff', "public/**/*.woff2", 'public/**/*.ttf', 'public/**/*.css', 'public/**/*.js'], { base: '.' })
        .pipe(gulp.dest('build'));

    gulp.src('manifest.json', { base: '.' })
        .pipe(gulp.dest('build'));

});

gulp.task('build:vendor', function () {
    var opts = assign({}, watchify.args, {
        require: ['react', 'react-dom'],
        entries: []
    });
    browserify(opts).bundle()
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('react.bundle.js'))
        .pipe(gulp.dest('./build/public/react'));
});

// This task go through each app.js file and browserify them
gulp.task('build:app', function (done) {

    var walk = function (dir) {
        //var results = []
        var list = fs.readdirSync(dir)
        list.forEach(function (file) {
            file = dir + '/' + file
            var stat = fs.statSync(file)
            if (stat && stat.isDirectory()) {
                //console.log(file);
                walk(file)
            }
            else if (file.endsWith('.js')) {
                // generate browserify task
                console.log(file);
                //console.log(path.dirname(file));
                var fullpath = file;
                var destPath = path.join('./build', path.dirname(file));
                console.log(destPath);
                var customOpts = {
                    entries: fullpath,
                    extensions: ['.js', '.jsx'],
                    debug: true,
                };
                var opts = assign({}, watchify.args, customOpts);
                var bify = watchify(browserify(opts).external(['react', 'react-dom']).transform("babelify", { presets: ["react"] }));
                function bibyBundle() {
                    return bundle = bify.bundle()
                        // log errors if they happen
                        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
                        .pipe(source(file))
                        // optional, remove if you don't need to buffer file contents
                        .pipe(buffer())
                        // optional, remove if you dont want sourcemaps
                        .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
                        // Add transformation tasks to the pipeline here.
                        .pipe(sourcemaps.write('./')) // writes .map file
                        .pipe(gulp.dest('./build'));
                    //return bundle;
                }

                bibyBundle();
                bify.on('update', bibyBundle); // on any dep update, runs the bundler
                bify.on('log', gutil.log); // output build logs to terminal
                console.log('tt');
            }
        });
    };

    walk('./scripts');
    done();
    // fs.readdir('scripts', function (err, files) {
    //     files.forEach(function (file, index) {
    //         if (file.endsWith('.app.js')) {
    //             var fullpath = path.join('./scripts', file);
    //             var customOpts = {
    //                 entries: fullpath,
    //                 extensions: ['.js', '.jsx'],
    //                 debug: true,
    //             };
    //             var opts = assign({}, watchify.args, customOpts);
    //             var bify = watchify(
    //                 browserify(opts).external(['react', 'react-dom']).transform("babelify", { presets: ["es2015", "react"] })
    //             )
    //             function bibyBundle() {
    //                 return bundle = bify.bundle()
    //                     // log errors if they happen
    //                     .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    //                     .pipe(source(file))
    //                     // optional, remove if you don't need to buffer file contents
    //                     .pipe(buffer())
    //                     // optional, remove if you dont want sourcemaps
    //                     .pipe(sourcemaps.init({ loadMaps: true })) // loads map from browserify file
    //                     // Add transformation tasks to the pipeline here.
    //                     .pipe(sourcemaps.write('./')) // writes .map file
    //                     .pipe(gulp.dest('./build/scripts'));
    //                 //return bundle;
    //             }

    //             bibyBundle();
    //             bify.on('update', bibyBundle); // on any dep update, runs the bundler
    //             bify.on('log', gutil.log); // output build logs to terminal
    //         }
    //     });
    //     done();
    // });
});



gulp.task('default', ['copy:images', 'copy:css', 'copy:html', 'copy:others', 'build:vendor', 'build:app']); // so you can run `gulp` to build the file

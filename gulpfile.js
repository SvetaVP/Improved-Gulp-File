var gulp = require('gulp');
var sass = require('gulp-sass');
var gcmq = require('gulp-group-css-media-queries');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var pug = require('gulp-pug');
var browserSync = require("browser-sync");

var path = {
    build: { // way to the finished files after the build
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
    },
    src: { // way to get the sources
        html: 'src/*.html', // We take all the files with the extension .html
        js: 'src/js/main.js',// In styles and scripts we need only files named main
        style: 'src/style/main.scss',
        img: 'src/img/**/*.*', //We take all the files from the folder and from the subfolders with all the extensions
        fonts: 'src/fonts/**/*.*' //We take away the fonts
    },
    watch: { // Here we indicate which files we want to monitor
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.scss',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*',
		pug: 'src/views/**/*.*'
    },
    clean: './build'
};

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'E://projecr-folder/build/'
        },
    })
});

gulp.task('pug', function buildHTML() { // task for template html
  return gulp.src('src/views/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('src/'))
    .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('html:build', ['pug'], function () {
    gulp.src(path.src.html) // Select the files by the required path
        .pipe(gulp.dest(path.build.html)) //send files to the build folder
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('js:build', function () {
    gulp.src(path.src.js) //find the file named main
        .pipe(gulp.dest(path.build.js)) //send files to the build folder
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('style:build', function () {
    gulp.src(path.src.style) //find the file named main
        .pipe(sass().on('error', sass.logError)) //compile the file, convert it to css
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        })) //adding vendor prefixes
        .pipe(gcmq()) //sorting media requests
        .pipe(gulp.dest(path.build.css)) //send files to the build folder
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('image:build', function () {
    gulp.src(path.src.img) //choose our pictures
        .pipe(imagemin({ // we compress them with the best settings
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.build.img)) //send files to the build folder
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('watch', ['browserSync'], function(){
	gulp.watch([path.watch.pug], function(event, cb) {
        gulp.start('pug');
    });
    gulp.watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    gulp.watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    gulp.watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    gulp.watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
   	gulp.watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});


gulp.task('default', ['build', 'watch']);
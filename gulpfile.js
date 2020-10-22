const gulp = require('gulp');
const less = require('gulp-less');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const clean = () => require('del')(["public"]);

function styles () {
    return gulp.src("./resources/styles/site.less")
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: "site",
            suffix: ".min"
        }))
        .pipe(gulp.dest("./public/"));
}

function scripts () {
    return gulp.src(["./resources/scripts/*.js", "./resources/page-scripts/*.js"])
        .pipe(babel())
        .pipe(concat("site.js"))
        .pipe(uglify())
        .pipe(rename({
            basename: "site",
            suffix: ".min"
        }))
        .pipe(gulp.dest("./public/"));
}

function images() {
    return gulp.src("./resources/images/*")
        .pipe(gulp.dest("./public/site-images/"));
}

function game_styles () {
    return gulp.src("./resources/styles/game.less")
        .pipe(less())
        .pipe(cleanCSS())
        .pipe(rename({
            basename: "game",
            suffix: ".min"
        }))
        .pipe(gulp.dest("./public/"));
}

function game_scripts () {
    return gulp.src("./resources/game.js")
        .pipe(babel())
        .pipe(concat("game.js"))
        .pipe(uglify())
        .pipe(rename({
            basename: "game",
            suffix: ".min"
        }))
        .pipe(gulp.dest("./public/"));
}

function game_images() {
    return gulp.src("./resources/images/*")
        .pipe(gulp.dest("./public/game-images/"));
}

gulp.task("site", gulp.series(clean, styles, scripts, images));
gulp.task("game", gulp.series(clean, game_styles, game_scripts, game_images));
gulp.task("default", gulp.series(clean, styles, scripts, images, game_styles, game_scripts, game_images));

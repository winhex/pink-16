"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var less = require("gulp-less");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");

gulp.task("css", function () {
  return gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
//    .pipe(minify())
//    .pipe(rename("style-min.css"))
//    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("server", function () {
  server.init({
    server: "source/",
    notify: false,
    open: false,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**/*.less", gulp.series("css"));
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("img-min", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
     .pipe(imagemin([
       imagemin.optipng({optimiztionLevel: 3}),
       imagemin.jpegtran({progressive: true}),
       imagemin.svgo()
     ]))
     
     .pipe(gulp.dest("source/img"));


});

gulp.task("webp", function () {
   return gulp.src("source/img/**/*.{png,jpg}")
      .pipe(webp({quality: 90}))
      .pipe(gulp.dest("source/img"));
 });

gulp.task("start", gulp.series("css", "server"));
"use strict";

const fs = require("fs");
const gulp = require("gulp");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const browser = require("browser-sync").create();
const panini = require("panini");
const yaml = require("js-yaml");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const named = require("vinyl-named");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const dartSass = require("sass");
const gulpSass = require("gulp-sass")(dartSass);
const cleanCss = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const gulpIf = require("gulp-if");

// Check for --production flag
const PRODUCTION = !!yargs(hideBin(process.argv)).parseSync().production;

// Load settings from config.yml
const { PORT, PATHS } = loadConfig();

function loadConfig() {
    const ymlFile = fs.readFileSync("config.yml", "utf8");
    return yaml.load(ymlFile);
}

// Build the "dist" folder by running all of the below tasks
gulp.task(
    "build",
    gulp.series(
        clean,
        gulp.parallel(pages, javascript, images, copy),
        sass,
        serverConfigCopy
    )
);

// Build the site, run the server, and watch for file changes
gulp.task("default", gulp.series("build", server, watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
    fs.rm(PATHS.dist, { recursive: true, force: true }, done);
}

// Copy files out of the assets folder
// This task skips over the "img", "js", and "scss" folders, which are parsed separately
function copy() {
    return gulp.src(PATHS.assets, { encoding: false }).pipe(gulp.dest(PATHS.dist + "/assets"));
}

function serverConfigCopy() {
    return gulp.src(PATHS.serverConfig, { dot: true }).pipe(gulp.dest(PATHS.dist));
}

// Copy page templates into finished HTML files
function pages() {
    return gulp
        .src("src/pages/**/*.{html,hbs,handlebars}")
        .pipe(
            panini({
                root: "src/pages/",
                layouts: "src/layouts/",
                partials: "src/partials/",
                data: "src/data/",
                helpers: "src/helpers/"
            })
        )
        .pipe(
            gulpIf(
                PRODUCTION,
                htmlmin({
                    collapseWhitespace: true
                })
            )
        )
        .pipe(gulp.dest(PATHS.dist));
}

// Load updated HTML templates and partials into Panini
function resetPages(done) {
    panini.refresh();
    done();
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
    return gulp
        .src("src/scss/app.scss", { sourcemaps: !PRODUCTION })
        .pipe(
            gulpSass({
                loadPaths: PATHS.sass,
                quietDeps: true,
                silenceDeprecations: [
                    "import",
                    "global-builtin",
                    "color-functions",
                    "slash-div"
                ]
            }).on("error", gulpSass.logError)
        )
        .pipe(postcss([autoprefixer()]))
        .pipe(cleanCss({ compatibility: "ie9" }))
        .pipe(gulp.dest(PATHS.dist + "/css", { sourcemaps: PRODUCTION ? false : "." }))
        .pipe(browser.stream());
}

const webpackConfig = {
    mode: PRODUCTION ? "production" : "development",
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                        compact: false
                    }
                }
            }
        ]
    },
    devtool: PRODUCTION ? false : "source-map"
};

// Combine JavaScript into one file
// In production, the file is minified by webpack
function javascript() {
    return gulp
        .src(PATHS.entries)
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest(PATHS.dist + "/js"));
}

// Copy images to the "dist" folder
function images() {
    return gulp
        .src("src/assets/images/**/*", { encoding: false })
        .pipe(gulp.dest(PATHS.dist + "/assets/images"));
}

// Start a server with BrowserSync to preview the site in
function server(done) {
    browser.init(
        {
            server: PATHS.dist,
            port: PORT,
            notify: false
        },
        done
    );
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
    gulp.watch(PATHS.assets, copy);
    gulp
        .watch("src/pages/**/*.html")
        .on("all", gulp.series(pages, browser.reload));
    gulp
        .watch("src/{layouts,partials}/**/*.html")
        .on("all", gulp.series(resetPages, pages, browser.reload));
    gulp
        .watch("src/data/**/*.{js,json,yml}")
        .on("all", gulp.series(resetPages, pages, browser.reload));
    gulp
        .watch("src/helpers/**/*.js")
        .on("all", gulp.series(resetPages, pages, browser.reload));
    gulp.watch("src/scss/**/*.scss").on("all", sass);
    gulp
        .watch("src/js/**/*.js")
        .on("all", gulp.series(javascript, browser.reload));
    gulp
        .watch("src/assets/images/**/*")
        .on("all", gulp.series(images, browser.reload));
}

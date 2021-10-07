#!/usr/bin/env node
// This file when run (i.e: npm run postbuild) will add a hash to these files: main.js, main.css, polyfills.js, vendor.js
// and will update index.html so that the script/link tags request those files with their corresponding hashes
// Based upon source: https://gist.github.com/haydenbr/7df417a8678efc404c820c61b6ffdd24
// Don't forget to: chmod 755 scripts/cache-busting.js

var fs = require('fs'),
    path = require('path'),
    cheerio = require('cheerio'),
    revHash = require('rev-hash');

var rootDir = path.resolve(__dirname, '../');
// var wwwRootDir = path.resolve(rootDir, 'platforms', 'browser', 'www');
var wwwRootDir = path.resolve(rootDir, 'www');
var buildDir = joinFilePath(wwwRootDir, 'build');
var indexPath = joinFilePath(wwwRootDir, 'index.html');

var cssPath = joinFilePath(buildDir, 'main.css');
var cssFileHash = revHash(fs.readFileSync(cssPath));
var cssNewFileName = `main.${cssFileHash}.css`;
var cssNewPath = joinFilePath(buildDir, cssNewFileName);
var cssNewRelativePath = joinFilePath('build', cssNewFileName);

var jsPath = joinFilePath(buildDir, 'main.js');
var jsFileHash = revHash(fs.readFileSync(jsPath));
var jsNewFileName = `main.${jsFileHash}.js`;
var jsNewPath = joinFilePath(buildDir, jsNewFileName);
var jsNewRelativePath = joinFilePath('build', jsNewFileName);

var jsPolyfillsPath = joinFilePath(buildDir, 'polyfills.js');
var jsPolyfillsFileHash = revHash(fs.readFileSync(jsPolyfillsPath));
var jsPolyfillsNewFileName = `polyfills.${jsPolyfillsFileHash}.js`;
var jsPolyfillsNewPath = joinFilePath(buildDir, jsPolyfillsNewFileName);
var jsPolyfillsNewRelativePath = joinFilePath('build', jsPolyfillsNewFileName);

var jsVendorPath = joinFilePath(buildDir, 'vendor.js');
var jsVendorFileHash = revHash(fs.readFileSync(jsVendorPath));
var jsVendorNewFileName = `vendor.${jsVendorFileHash}.js`;
var jsVendorNewPath = joinFilePath(buildDir, jsVendorNewFileName);
var jsVendorNewRelativePath = joinFilePath('build', jsVendorNewFileName);

var jsSwtoolboxPath = joinFilePath(buildDir, 'sw-toolbox.js');
var jsSwtoolboxFileHash = revHash(fs.readFileSync(jsSwtoolboxPath));
var jsSwtoolboxNewFileName = `sw-toolbox.${jsSwtoolboxFileHash}.js`;
var jsSwtoolboxNewPath = joinFilePath(buildDir, jsSwtoolboxNewFileName);
var jsSwtoolboxNewRelativePath = joinFilePath('build', jsSwtoolboxNewFileName);


// rename main.css to main.[hash].css
fs.renameSync(cssPath, cssNewPath);

// rename main.js to main.[hash].js
fs.renameSync(jsPath, jsNewPath);

// rename polyfills.js to polyfills.[hash].js
fs.renameSync(jsPolyfillsPath, jsPolyfillsNewPath);

// rename vendor.js to vendor.[hash].js
fs.renameSync(jsVendorPath, jsVendorNewPath);

// rename sw-toolbox.js to sw-toolbox.[hash].js
// fs.renameSync(jsSwtoolboxPath, jsSwtoolboxNewPath);

// update index.html to load main.[hash].css
$ = cheerio.load(fs.readFileSync(indexPath, 'utf-8'));

$('head link[href="build/main.css"]').attr('href', cssNewRelativePath);
$('body script[src="build/main.js"]').attr('src', jsNewRelativePath);
$('body script[src="build/polyfills.js"]').attr('src', jsPolyfillsNewRelativePath);
$('body script[src="build/vendor.js"]').attr('src', jsVendorNewRelativePath);
// $('body script[src="build/sw-toolbox.js"]').attr('src', jsSwtoolboxNewRelativePath);

// const jsSWorker = $(`<script type="text/javascript">
//    if (\'serviceWorker\' in navigator) {
//       navigator.serviceWorker.register(\'service-worker.${jsSwtoolboxFileHash}.js\')
//         .then(() => console.log(\'service worker installed\'))
//         .catch(err => console.error(\'Error\', err));
//     }
//    </script>`);
// $('#s_worker').replaceWith(jsSWorker);

fs.writeFileSync(indexPath, $.html());

function joinFilePath(dir, filename) {
    // return path.join(dir, filename)
    return dir + '/' + filename;
}
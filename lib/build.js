const path = require('path')
const fs = require('fs')
const gulp = require('gulp')
const ora = require('ora')
const nop = require('gulp-nop')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const cssmin = require('gulp-cssmin')
const series = require('gulp4-run-sequence').use(gulp)
const config = require('./config')

const fonts = function (opts = {}) {
  const { targetFontsRoot, minimize, out } = opts
  const spin = ora(opts.message || '编译字体主题').start()
  const stream = gulp.src(path.resolve(targetFontsRoot, '**'))
    .pipe(minimize ? cssmin({ showLog: false }) : nop())
    .pipe(gulp.dest(path.resolve(out, './fonts')))
    .on('end', () => spin.succeed())
  return stream
}

const build = function (opts = {}) {
  const { minimize, out, targetThemeVarPath, themeDir, themeVarPath, browsers } = opts
  const spin = ora(opts.message || '编译主题').start()
  let cssFiles = '*'
  fs.writeFileSync(targetThemeVarPath, fs.readFileSync(themeVarPath, 'utf-8'))

  const stream = gulp.src([targetThemeVarPath, path.resolve(themeDir, cssFiles + '.scss')])
    .pipe(sass.sync())
    .pipe(autoprefixer({
      browsers: browsers || config.browsers,
      cascade: false
    }))
    .pipe(minimize ? cssmin({ showLog: false }) : nop())
    .pipe(gulp.dest(out))
    .on('end', () => spin.succeed())

  return stream
}

const run = function (opts = {}, cb) {
  gulp.task('build', function () {
    return build(opts)
  })
  gulp.task('fonts', function () {
    return fonts(opts)
  })
  if (typeof cb === 'function') {
    return series('build', 'fonts', cb);
  }
  return series('build', 'fonts');
}

module.exports = {
  themeBuild: run
}
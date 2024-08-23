#!/usr/bin/env node

const program = require('commander')
const { themeInit } = require('../lib/init.js')
const { setDefaultVarColor } = require('../lib/var.js')

program
  .version(require('../package.json').version)
  .option('-i --init', 'init variables file')
  .option('-s --setVarColor', 'set var default color',function (color) {console.log(color)})
  .parse(process.argv)

if (program.init) {
   themeInit()
}

if (program.setVarColor) {
    setDefaultVarColor()
}
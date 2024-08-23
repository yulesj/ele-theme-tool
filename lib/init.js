const path = require('path')
const fs = require('fs')
const ora = require('ora')
const glob = require('glob');
const config = require('./config')
const { mixReplace } = require('./util')

// 默认为element-ui主题路径
const defaultThemePath = path.resolve(process.cwd(), 'node_modules', config.themeName)

const checkPath = function (p) {
  if (!fs.existsSync(p)) {
    ora('please install `' + p + '`').fail()
    process.exit(1)
  }
}

const getInjectScss = function () {
  return fs.readFileSync(path.resolve(__dirname,'./inject.scss')).toString() +  '\r\n';
}

const injectStr = getInjectScss()

const init = async function (options = {}) {
  const { targetThemePathRoot, themeDir, themeVarName, themeVarPath } = options
  checkPath(targetThemePathRoot || defaultThemePath)
  var spinner = ora().start()
  let themePath =  themeDir || defaultThemePath
  const scssFiles = await glob('**/*.scss', {
    sync: true,
    cwd: themePath
  })
  let tvp = themeVarPath || config.eleVarPath
  scssFiles.forEach(v => {
    let filePath = ''
    if (v == tvp) {
      filePath = path.resolve(process.cwd(), `${themeVarName || config.config}`)
      if (fs.existsSync(filePath)) {
        spinner.text = `${themeVarName || config.config} 文件已经生成，如果需要新生成文件，请注意备份老文件，然后已生成的老文件！`
        spinner.fail()
        return
      }
    }
    let successTxt = v;
      const varsPath = path.resolve(`${themePath}/${v}`)
      let varStr = fs.readFileSync(varsPath)
      varStr = mixReplace(varStr.toString(), v)
      // 此处是为了注入写好的 mixToVar 代码在scss变量入口文件中
      if (v == tvp) {
        varStr = injectStr + varStr
        successTxt = config.config
      }
      fs.writeFileSync(filePath || varsPath, varStr, 'utf-8')
      spinner.text = `${successTxt} 生成成功.`
      spinner.succeed()
  })
}

module.exports = {
  themeInit: init
}



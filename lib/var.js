const path = require('path')
const fs = require('fs')
const glob = require("glob");
const config = require('./config')
const { varReplace } = require('./util')

const setVarColor = async function (options = {}) {
    const { varConfig = {'--customize-theme': '#409EFF'}, themeDir, webJsDir } = options;
    const dir = path.resolve(process.cwd(), themeDir || config.eleThemeDir)
    const cssFiles = await glob('*.css', {
        sync: true,
        cwd: dir
    });
    cssFiles.forEach(item => {
        const cssItem = fs.readFileSync(path.resolve(dir, item)).toString()
        const newStr = varReplace(cssItem, varConfig)
        fs.writeFileSync(path.resolve(dir, item), newStr, 'utf-8')
    });
    createWebJs(webJsDir)
}

const createWebJs = function(webJsDir) {
    const keyMap = config.keyMap
    const keys = Object.keys(keyMap);
    let injectWebJsPath = path.resolve(__dirname, './injectWeb.js')
    let webJsPath = path.resolve(webJsDir || process.cwd(), 'theme-tool-web.js')
    const webJs = fs.readFileSync(injectWebJsPath).toString()
    const codeStr = `const keys = ${JSON.stringify(keys)}`+ '\r\n' + webJs
    fs.writeFileSync(webJsPath, codeStr, 'utf-8')
}

module.exports = {
    setDefaultVarColor: setVarColor
}
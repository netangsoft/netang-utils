const fs = require('fs')
const fileExists = require('./fileExists')

/*
 * 【node】读取文件内容
 */
function readFile(filePath, options = 'utf-8', defaultValue = '') {

    // 如果文件不存在
    if (! fileExists(filePath)) {
        return defaultValue
    }

    // 读取文件内容
    return fs.readFileSync(filePath, options)
}

module.exports = readFile

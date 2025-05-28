const fs = require('fs')
const fileExistsSync = require('./fileExistsSync')

/*
 * 读取文件内容
 */
function readFileSync(filePath, options = 'utf-8', defaultValue = '') {

    // 如果文件存在
    return fileExistsSync(filePath)
        // 读取文件内容
        ? fs.readFileSync(filePath, options)
        // 否则返回默认值
        : defaultValue
}

module.exports = readFileSync

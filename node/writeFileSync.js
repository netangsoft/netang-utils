const path = require('path')
const fs = require('fs')
const mkdirSync = require('./mkdirSync')

/*
 * 写入文件
 */
function writeFileSync(filePath, ...args) {

    // 创建文件所在目录
    mkdirSync(path.dirname(filePath))

    // 写入文件
    fs.writeFileSync(filePath, ...args)
}

module.exports = writeFileSync

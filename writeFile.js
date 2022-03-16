const path = require('path')
const fs = require('fs')
const dirExists = require('./dirExists')
const mkdir = require('./mkdir')

/*
 * 写入文件
 */
function writeFile(filePath, ...args) {

    // 获取文件所在目录
    const dir = path.dirname(filePath)

    // 如果目录不存在, 则创建目录
    if (! dirExists(dir)) {
        mkdir(dir)
    }

    // 写入文件
    fs.writeFileSync(filePath, ...args)
}

module.exports = writeFile

const path = require('path')
const fsWriteFile = require('./promisify/fsWriteFile')
const mkdir = require('./mkdir')

/*
 * 写入文件
 */
async function writeFile(filePath, ...args) {

    // 创建文件所在目录
    await mkdir(path.dirname(filePath))

    // 写入文件
    await fsWriteFile(filePath, ...args)
}

module.exports = writeFile

const fsReadFile = require('./promisify/fsReadFile')
const fileExists = require('./fileExists')

/*
 * 读取文件内容
 */
async function readFile(filePath, options = 'utf-8', defaultValue = '') {

    // 如果文件存在
    return await fileExists(filePath)
        // 读取文件内容
        ? await fsReadFile(filePath, options)
        // 否则返回默认值
        : defaultValue
}

module.exports = readFile

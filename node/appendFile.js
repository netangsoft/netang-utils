const fsAppendFile = require('./promisify/fsAppendFile')
const fileExists = require('./fileExists')
const writeFile = require('./writeFile')

/*
 * 追加文件
 */
async function appendFile(filePath, data, ...args) {

    // 如果文件存在
    if (await fileExists(filePath)) {
        // 追加文件
        await fsAppendFile(filePath, data, ...args)

    // 否则写入文件
    } else {
        await writeFile(filePath, data)
    }
}

module.exports = appendFile

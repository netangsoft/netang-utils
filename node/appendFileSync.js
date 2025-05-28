const fs = require('fs')
const fileExistsSync = require('./fileExistsSync')
const writeFileSync = require('./writeFileSync')

/*
 * 追加文件
 */
function appendFileSync(filePath, data, options) {

    // 如果文件存在
    if (fileExistsSync(filePath)) {
        // 追加文件
        fs.appendFileSync(filePath, data, options)

    // 否则写入文件
    } else {
        writeFileSync(filePath, data)
    }
}

module.exports = appendFileSync

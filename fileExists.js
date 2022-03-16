const fs = require('fs')

/*
 * 【node】文件是否存在
 */
function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile()
    } catch(e) {}
    return false
}

module.exports = fileExists

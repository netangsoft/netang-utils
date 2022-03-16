const fs = require('fs')

/*
 * 【node】文件夹是否存在
 */
function dirExists(filePath) {
    try {
        return fs.statSync(filePath).isDirectory()
    } catch(e) {}
    return false
}

module.exports = dirExists

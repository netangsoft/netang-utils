const fs = require('fs')

/*
 * 文件是否存在
 */
function fileExistsSync(filePath) {
    try {
        return ! fs.statSync(filePath).isDirectory()
    } catch(e) {}
    return false
}

module.exports = fileExistsSync

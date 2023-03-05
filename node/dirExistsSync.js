const fs = require('fs')

/*
 * 文件夹是否存在
 */
function dirExistsSync(filePath) {
    try {
        return fs.statSync(filePath).isDirectory()
    } catch(e) {}
    return false
}

module.exports = dirExistsSync

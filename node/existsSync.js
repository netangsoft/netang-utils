const fs = require('fs')

/*
 * 文件/文件夹是否存在
 */
function existsSync(filePath) {
    try {
        fs.statSync(filePath)
        return true
    } catch(e) {}
    return false
}

module.exports = existsSync

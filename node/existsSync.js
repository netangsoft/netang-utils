const fs = require('fs')

/*
 * 文件/文件夹是否存在
 */
function existsSync(filePath) {
    try {
        const stat = fs.statSync(filePath)
        return stat.isDirectory() || stat.isFile()
    } catch(e) {}
    return false
}

module.exports = existsSync

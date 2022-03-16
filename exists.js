const fs = require('fs')

/*
 * 【node】文件/文件夹是否存在
 */
function exists(filePath) {
    try {
        const stat = fs.statSync(filePath)
        return stat.isDirectory() || stat.isFile()
    } catch(e) {}
    return false
}

module.exports = exists

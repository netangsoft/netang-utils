const fs = require('fs')

/*
 * 文件是否存在
 */
function fileExistsSync(filePath) {
    try {
        const stat = fs.statSync(filePath)
        return ! stat.isDirectory()
    } catch(e) {}
    return false
}

module.exports = fileExistsSync

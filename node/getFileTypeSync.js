const fs = require('fs')

/*
 * 获取文件类型
 */
function getFileTypeSync(filePath) {
    try {
        const stat = fs.statSync(filePath)
        return stat.isDirectory() ? 'dir' : 'file'

    } catch(e) {}

    return ''
}

module.exports = getFileTypeSync

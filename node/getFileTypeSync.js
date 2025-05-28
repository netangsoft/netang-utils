const fs = require('fs')

/*
 * 获取文件类型
 */
function getFileTypeSync(filePath) {
    try {
        return fs.statSync(filePath).isDirectory() ? 'dir' : 'file'
    } catch(e) {}
    return ''
}

module.exports = getFileTypeSync

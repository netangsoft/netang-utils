const fs = require('fs')

/*
 * 获取文件类型
 */
function getFileTypeSync(filePath) {
    try {
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
            return 'dir'
        }

        if (stat.isFile()) {
            return 'file'
        }

    } catch(e) {}

    return ''
}

module.exports = getFileTypeSync

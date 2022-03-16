const fs = require('fs')

/*
 * 【node】获取文件类型
 */
function getFileType(filePath) {
    try {
        const stat = fs.statSync(filePath)

        if (stat.isDirectory()) {
            return 'dir'
        }

        if (stat.isFile()) {
            return 'file'
        }

    } catch(e) {}
}

module.exports = getFileType

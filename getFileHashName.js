const fs = require('fs')
const crypto = require('crypto')

/**
 * 【node】获取文件 hash 名称
 */
function getFileHashName(filePath, length = 8) {
    return crypto
        .createHash('md4')
        .update(fs.readFileSync(filePath))
        .digest('hex')
        .slice(0, length)
}

module.exports = getFileHashName

const fs = require('fs')
const crypto = require('crypto')

/**
 * 获取文件 hash 名称
 */
function getFileHashNameSync(filePath, length = 8, algorithm = 'md4') {
    return crypto
        .createHash(algorithm)
        .update(fs.readFileSync(filePath))
        .digest('hex')
        .slice(0, length)
}

module.exports = getFileHashNameSync

const fs = require('fs')
const crypto = require('crypto')

/**
 * 获取文件 hash
 * @param filePath
 * @param algorithm 算法
 * @returns {string}
 */
function getFileHashSync(filePath, algorithm = 'md5') {
    return crypto.createHash(algorithm)
        .update(fs.readFileSync(filePath))
        .digest('hex')
}

module.exports = getFileHashSync

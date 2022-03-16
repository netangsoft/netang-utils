const fs = require('fs')
const crypto = require('crypto')

/**
 * 【node】获取文件 hash
 */
function getFileHash(filePath) {
    return crypto.createHash('sha1')
        .update(fs.readFileSync(filePath))
        .digest('hex')
}

module.exports = getFileHash

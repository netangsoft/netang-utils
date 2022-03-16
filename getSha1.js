const crypto = require('crypto')

/**
 * 【node】获取 sha1
 */
function getSha1(str) {
    return crypto.createHash('sha1')
        .update(str)
        .digest('hex')
}

module.exports = getSha1

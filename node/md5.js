const crypto = require('crypto')

/**
 * 获取 md5
 */
function md5(str) {
    return crypto.createHash('md5')
        .update(str)
        .digest('hex')
}

module.exports = md5

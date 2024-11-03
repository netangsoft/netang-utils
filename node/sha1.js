import crypto from 'crypto'

/**
 * 获取 sha1
 */
function sha1(str) {
    return crypto.createHash('sha1')
        .update(str)
        .digest('hex')
}

export default sha1

import crypto from 'crypto'

/**
 * 获取 md5
 */
function md5(str) {
    return crypto.createHash('md5')
        .update(str)
        .digest('hex')
}

export default md5

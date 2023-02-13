const _sha1 = require('./sha1')

/**
 * 生成签名
 */
function sign(data, verifyKey, ignoreKeys = []) {
    const contents = []

    if (
        data != null
        && Object.prototype.toString.call(data) === '[object Object]'
    ) {
        if (! Array.isArray(ignoreKeys) || ! ignoreKeys.length) {
            ignoreKeys = []
        }

        const keys = []

        for (const key in data) {
            if (ignoreKeys.indexOf(key) === -1) {
                keys.push(key)
            }
        }

        if (keys.length) {
            keys.sort()
            for (const key of keys) {
                contents.push(`${key}=${data[key]}`)
            }
        }
    }

    contents.push(`verify_key=${verifyKey}`)
    return _sha1(contents.join('&'))
}

module.exports = sign

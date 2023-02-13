const _sha1 = require('./sha1')

/**
 * 验证签名
 */
function verify(data, verifyKey, ignoreKeys = []) {
    if (data != null && Object.prototype.toString.call(data) === '[object Object]') {
        if (! Array.isArray(ignoreKeys) || ! ignoreKeys.length) {
            ignoreKeys = []
        }
        
        let sign

        const keys = []

        for (const key in data) {
            if (key === 'sign') {
                sign = data[key]
            } else if (ignoreKeys.indexOf(key) === -1) {
                keys.push(key)
            }
        }

        if (sign) {
            const contents = []

            if (keys.length) {
                keys.sort()
                for (const key of keys) {
                    contents.push(`${key}=${data[key]}`)
                }
            }

            contents.push(`verify_key=${verifyKey}`)
            return _sha1(contents.join('&')) === sign
        }
    }
    return false
}

module.exports = verify

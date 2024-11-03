/**
 * base64 加密
 */
function encrypt(value, isJson = false) {
    return Buffer.from(isJson ? JSON.stringify(value) : value).toString('base64')
}

/**
 * base64 解密
 */
function decrypt(value, isJson = false) {
    const res = Buffer.from(value, 'base64').toString()
    return isJson ? JSON.parse(res) : res
}

export default {
    encrypt,
    decrypt,
}

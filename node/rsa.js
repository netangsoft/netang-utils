const crypto = require('crypto')
const $n_isValidArray = require('../cjs/isValidArray')
const $n_isValidObject = require('../cjs/isValidObject')
const _sha1 = require('./sha1')

// 设置
const rsaSettings = {
    // 公钥
    publicKey: '',
    // 密钥
    privateKey: '',
    // 签名键值
    signKey: 'verify_key',
}

/**
 * 公钥加密
 */
function publicEncrypt(value) {
    try {
        return crypto.publicEncrypt({
            // 密钥
            key: rsaSettings.publicKey,
            // 和 php 保持一致
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(JSON.stringify(value))).toString('base64')

    } catch (e) {}
    return null
}

/**
 * 公钥解密
 */
function publicDecrypt(value) {
    try {
        return JSON.parse(crypto.publicDecrypt({
            // 密钥
            key: rsaSettings.publicKey,
            // 和 php 保持一致
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(value.toString('base64'), 'base64')))

    } catch (e) {}
    return null
}

/**
 * 私钥加密(服务端)
 */
function privateEncrypt(value) {
    try {
        return crypto.privateEncrypt({
            // 密钥
            key: rsaSettings.privateKey,
            // 和 php 保持一致
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(JSON.stringify(value))).toString('base64')

    } catch (e) {}
    return null
}

/**
 * 私钥解密(服务端)
 */
function privateDecrypt(value) {
    try {
        return utils.json.parse(crypto.privateDecrypt({
            // 密钥
            key: rsaSettings.privateKey,
            // 和 php 保持一致
            padding: crypto.constants.RSA_PKCS1_PADDING,
        }, Buffer.from(value.toString('base64'), 'base64')))

    } catch (e) {}
    return null
}

/**
 * 生成签名
 */
function sign(data, verifyKey, ignoreKeys = []) {

    const contents = []

    if ($n_isValidObject(data)) {

        if (! $n_isValidArray(ignoreKeys)) {
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

    contents.push(`${rsaSettings.signKey}=${verifyKey}`)

    return _sha1(contents.join('&'))
}

/**
 * 验证签名
 */
function verify(data, verifyKey, ignoreKeys = []) {

    if ($n_isValidObject(data)) {

        if (! $n_isValidArray(ignoreKeys)) {
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

            contents.push(`${rsaSettings.signKey}=${verifyKey}`)
            return _sha1(contents.join('&')) === sign
        }
    }
    return false
}

/**
 * 设置
 */
function settings(params) {
    Object.assign(rsaSettings, params)
}

module.exports = {
    // 设置
    settings,
    // 公钥加密
    publicEncrypt,
    // 公钥解密
    publicDecrypt,
    // 私钥加密(服务端)
    privateEncrypt,
    // 私钥解密(服务端)
    privateDecrypt,

    // 生成签名
    sign,
    // 验证签名
    verify,
}

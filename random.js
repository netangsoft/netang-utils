const _sample = require('lodash/sample')

/**
 * 获取随机字符串
 * @param {number} length 随机长度
 * @returns {string}
 */

const numberPool = '123456789'
const StringPool = 'abcdefghijkmnpqrstuvwxyz'

function randomBuild(pool, length = 16) {
    let str = ''
    for (let i = 0; i < length; i++) {
        str += _sample(pool)
    }
    return str
}

module.exports = {
    // 随机数字和字母
    alnum(length = 16) {
        return randomBuild(numberPool + StringPool, length)
    },
    // 随机字母
    alpha(length = 16) {
        return randomBuild(StringPool, length)
    },
    // 随机数字
    numeric(length = 16) {
        return randomBuild('0' + numberPool, length)
    },
    // 不含 0 的随机数字
    nozero(length = 16) {
        return randomBuild(numberPool, length)
    },
}

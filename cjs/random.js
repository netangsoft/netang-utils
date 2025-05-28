const $n_sample = require('lodash/sample')

const numberPool = '123456789'
const StringPool = 'abcdefghijkmnpqrstuvwxyz'

function randomBuild(pool, length = 16) {
    let str = ''
    for (let i = 0; i < length; i++) {
        str += $n_sample(pool)
    }
    return str
}

/**
 * 随机数
 */
const random = {
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



module.exports = random
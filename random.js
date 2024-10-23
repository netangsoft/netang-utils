import $n_sample from 'lodash/sample'

const numberPool = '123456789'
const StringLowerPool = 'abcdefghijkmnpqrstuvwxyz'
const StringUpperPool = 'ABCDEFGHIJKMNPQRSTUVWXYZ'

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
    alnum(length = 16, isUpper = false) {
        return randomBuild(numberPool + StringLowerPool + (isUpper ? StringUpperPool : ''), length)
    },
    // 随机字母
    alpha(length = 16, isUpper = false) {
        return randomBuild(StringLowerPool + (isUpper ? StringUpperPool : ''), length)
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

export default random

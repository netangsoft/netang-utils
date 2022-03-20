const _sample = require('lodash/sample')

/**
 * 获取随机数字
 * @param {number} length 随机长度
 * @returns {string}
 */
function getRandomNumeric(length = 16, hasZero =  false) {

    const pool = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
    if (hasZero) {
        pool.push('0')
    }

    let str = ''
    for (let i = 0; i < length; i++) {
        str += _sample(pool)
    }
    return str
}

module.exports = getRandomNumeric

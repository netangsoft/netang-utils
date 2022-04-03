const _isString = require('lodash/isString')

/**
 * 替换为星号
 * @param {number|string} val 值
 * @param {number} start 开始
 * @param {number} end 结束
 * @param {number} starCount 星号数量
 * @returns {string}
 */

function replaceStar(val, start = 1, end = 1, starCount = 0) {

    if (! _isString(val)) {
        val = String(val)
    }

    const { length } = val

    // 开头
    let content = val.substr(0, start)

    // 中间星号
    const num = starCount || length - start - end
    for (let i = 0; i < num; i++) {
        content += '*'
    }

    // 最后部分
    return content + val.substr(length - start - 1)
}

module.exports = replaceStar

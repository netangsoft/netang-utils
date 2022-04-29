const _isNumber = require('lodash/isNumber')
const isFillString = require('./isFillString')

/*
 * 拆分字符串
 * @param {string} str 要拆分的字符串
 * @param {string|RegExp} separator 拆分的分隔符
 * @param {number} limit 限制结果的数量
 * @returns {array}
 */
function split(str = '', separator, limit) {

    if (_isNumber(str)) {
        str = String(str)
    }

    if (isFillString(str)) {
        return str.split(separator, limit)
    }

    return []
}

module.exports = split

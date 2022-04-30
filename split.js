const _isNumber = require('lodash/isNumber')
const toNumberDeep = require('./toNumberDeep')
const isFillString = require('./isFillString')

/*
 * 拆分字符串
 * @param {string} str 要拆分的字符串
 * @param {string|RegExp} separator 拆分的分隔符
 * @param {number} limit 限制结果的数量
 * @returns {array}
 */
function split(str = '', separator, limit, isToNumberDeep = true) {

    if (_isNumber(str)) {
        str = String(str)
    }

    if (isFillString(str)) {
        const arr = str.split(separator, limit)
        return isToNumberDeep ? toNumberDeep(arr) : arr
    }

    return []
}

module.exports = split

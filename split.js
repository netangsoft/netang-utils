const _isNumber = require('lodash/isNumber')
const numberDeep = require('./numberDeep')
const isValidString = require('./isValidString')

/*
 * 拆分字符串
 * @param {string} str 要拆分的字符串
 * @param {string|RegExp} separator 拆分的分隔符
 * @param {number} limit 限制结果的数量
 * @param {boolean} toNumberDeep 深度转换为数字
 * @returns {array}
 */
function split(str = '', separator, limit, toNumberDeep = true) {

    if (_isNumber(str)) {
        str = String(str)
    }

    if (isValidString(str)) {
        const arr = str.split(separator, limit)
        return toNumberDeep ? numberDeep(arr) : arr
    }

    return []
}

module.exports = split

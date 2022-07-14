const _isString = require('lodash/isString')
const _isNumber = require('lodash/isNumber')
const _trim = require('lodash/trim')

/**
 * 去除首位空格的字符串
 * @param {number|string} val 值
 * @returns {string}
 */
function trimString(val) {

    if (_isString(val)) {
        return _trim(val)
    }

    if (_isNumber(val)) {
        return String(val)
    }

    return ''
}

module.exports = trimString

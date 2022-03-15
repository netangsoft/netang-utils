const _isNumber = require('lodash/isNumber')
const _isString = require('lodash/isString')

/**
 * 检查是否为数字(包括字符串数字)
 * @param {number|string} value
 * @returns {boolean}
 */

function isNumeric(value) {

    return _isNumber(value) || (
        _isString(value)
        && (value - parseFloat(value) + 1) >= 0
    )
}

module.exports = isNumeric

const _isString = require('lodash/isString')

/**
 * 检查是否为非空字符串
 * @param value
 * @returns {boolean}
 */

function isFillString(value) {

    return _isString(value) && value.length > 0
}

module.exports = isFillString

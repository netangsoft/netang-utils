const _isString = require('lodash/isString')
const _trim = require('lodash/trim')

/**
 * 检查是否为非空字符串
 * @param value
 * @returns {boolean}
 */

function isFillString(value) {

    return _isString(value) && _trim(value).length > 0
}

module.exports = isFillString

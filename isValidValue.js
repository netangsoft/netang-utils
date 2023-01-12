const _isNil = require('lodash/isNil')
const _isString = require('lodash/isString')
const _trim = require('lodash/trim')

/**
 * 是否为有效值
 * @param value 值
 * @param allowEmptyString 是否允许空字符串
 * @returns {boolean} true: 非空字符串/有效数字
 */
function isValidValue(value, allowEmptyString = false) {
    if (! _isNil(value)) {
        if (_isString(value)) {
            return allowEmptyString ? true : _trim(value).length
        }
        return Number.isFinite(value)
    }
    return false
}

module.exports = isValidValue

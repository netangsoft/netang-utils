const _isNil = require('lodash/isNil')
const _isString = require('lodash/isString')
const _trim = require('lodash/trim')
const _isNumber = require('lodash/isNumber')

/**
 * 是否为有效值
 * @param value
 * @returns {boolean} true: 非空字符串/有效数字
 */
function isValidValue(value) {
    if (! _isNil(value)) {
        if (_isString(value)) {
            return _trim(value).length
        }
        return _isNumber(value) && Number.isFinite(value)
    }
    return false
}

module.exports = isValidValue

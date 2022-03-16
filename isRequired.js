const _isNull = require('lodash/isNull')
const _isString = require('lodash/isString')
const _trim = require('lodash/trim')
const _isNumber = require('lodash/isNumber')
const isFillArray = require('./isFillArray')
const isFillObject = require('./isFillObject')

/**
 * 是否有值
 * @param value 字符串/数字/非空对象/非空数组
 * @returns {boolean}
 */
function isRequired(value) {
    return ! _isNull(value)
        && (
            _isString(value)
            && _trim(value).length
        )
        || _isNumber(value)
        || isFillArray(value)
        || isFillObject(value)
}

module.exports = isRequired

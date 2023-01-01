const _isNil = require('lodash/isNil')
const _isString = require('lodash/isString')
const _trim = require('lodash/trim')
const _isNumber = require('lodash/isNumber')
const isFillArray = require('./isFillArray')
const isFillObject = require('./isFillObject')

/**
 * 是否有值
 * @param value
 * @returns {boolean} true: 非空字符串/数字/非空对象/非空数组
 */
function isRequired(value) {

    if (_isNil(value)) {
        return false
    }

    if (_isString(value)) {
        return _trim(value).length
    }

    return _isNumber(value)
        || isFillArray(value)
        || isFillObject(value)
}

module.exports = isRequired

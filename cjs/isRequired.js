const $n_isValidArray = require('./isValidArray')
const $n_isValidObject = require('./isValidObject')
const $n_isValidValue = require('./isValidValue')

/**
 * 是否有值
 * @param value
 * @returns {boolean} true: 非空字符串/有效数字/非空对象/非空数组
 */
function isRequired(value) {
    return $n_isValidValue(value)
        || $n_isValidArray(value)
        || $n_isValidObject(value)
}

module.exports = isRequired
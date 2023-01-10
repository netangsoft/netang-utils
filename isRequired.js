const isFillArray = require('./isFillArray')
const isFillObject = require('./isFillObject')
const isValidValue = require('./isValidValue')

/**
 * 是否有值
 * @param value
 * @returns {boolean} true: 非空字符串/有效数字/非空对象/非空数组
 */
function isRequired(value) {
    return isValidValue(value)
        || isFillArray(value)
        || isFillObject(value)
}

module.exports = isRequired

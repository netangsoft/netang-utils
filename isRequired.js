const isFillArray = require('./isFillArray')
const isFillObject = require('./isFillObject')


/**
 * 是否有值
 * @param value 字符串/数字/非空对象/非空数组
 * @returns {boolean}
 */

function isRequired(value) {
    return ! _.isNull(value)
        && (
            _.isString(value)
            && _.trim(value).length
        )
        || _.isNumber(value)
        || isFillArray(value)
        || isFillObject(value)
}

module.exports = isRequired

import _isNull from 'lodash/isNull'
import _isString from 'lodash/isString'
import _trim from 'lodash/trim'
import _isNumber from 'lodash/isNumber'
import isFillArray from './isFillArray'
import isFillObject from './isFillObject'

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

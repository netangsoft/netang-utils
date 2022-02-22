import _isNumber from 'lodash/isNumber'
import _isString from 'lodash/isString'

/**
 * 检查是否为数字(包括字符串数字)
 * @param {number|string} value
 * @returns {boolean}
 */

function isNumeric(value) {

    return _isNumber(value) || (
        _isString(value)
        && (value - parseFloat(value) + 1) >= 0
    )
}

export default isNumeric

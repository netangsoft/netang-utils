import _isString from 'lodash/isString'

/**
 * 检查是否为非空字符串
 * @param value
 * @returns {boolean}
 */

function isFillString(value) {

    return _isString(value) && value.length > 0
}

export default isFillString

import _isArray from 'lodash/isArray'

/**
 * isFillArray
 * 检查是否为非空数组
 * @param value
 * @returns {boolean}
 */

module.exports = function (value) {
    return _isArray(value) && value.length > 0
}

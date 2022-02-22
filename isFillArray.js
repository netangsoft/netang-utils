import _isArray from 'lodash/isArray'

/**
 * isFillArray
 * 检查是否为非空数组
 * @param value
 * @returns {boolean}
 */

function isFillArray(value) {
    return _isArray(value) && value.length > 0
}

export default isFillArray

import _isObject from 'lodash/isObject'
import _isFunction from 'lodash/isFunction'

/**
 * 检查是否为 Promise
 * @param value
 * @returns {boolean}
 */

function isPromise(value) {
    return _isObject(value)
        && _isFunction(value.then)
        && _isFunction(value.catch)
}

export default isPromise

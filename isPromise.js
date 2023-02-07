import $n_isObject from 'lodash/isObject'
import $n_isFunction from 'lodash/isFunction'

/**
 * 检查是否为 Promise
 * @param value
 * @returns {boolean}
 */
export default function isPromise(value) {
    return $n_isObject(value)
        && $n_isFunction(value.then)
        && $n_isFunction(value.catch)
}

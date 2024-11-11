import $n_isObject from 'lodash-es/isObject.js'
import $n_isFunction from 'lodash-es/isFunction.js'

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

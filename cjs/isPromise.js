const $n_isObject = require('lodash/isObject')
const $n_isFunction = require('lodash/isFunction')

/**
 * 检查是否为 Promise
 * @param value
 * @returns {boolean}
 */
function isPromise(value) {
    return $n_isObject(value)
        && $n_isFunction(value.then)
        && $n_isFunction(value.catch)
}

module.exports = isPromise
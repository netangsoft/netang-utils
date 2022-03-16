const _isObject = require('lodash/isObject')
const _isFunction = require('lodash/isFunction')

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

module.exports = isPromise

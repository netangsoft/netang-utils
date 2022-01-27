const _ = require('lodash')

/**
 * 检查是否为 Promise
 * @param value
 * @returns {boolean}
 */

function isPromise(value) {
    return _.isObject(value)
        && _.isFunction(value.then)
        && _.isFunction(value.catch)
}

module.exports = isPromise

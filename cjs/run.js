const $n_isFunction = require('lodash/isFunction')

/**
 * 运行函数
 * @param {Function} func
 * @param thisArg
 * @returns {Function}
 */
function run(func, thisArg = null) {
    return $n_isFunction(func) ? function (...args) {
        return func.call(thisArg, ...args)
    } : function () {}
}

module.exports = run
const _isFunction = require('lodash/isFunction')

/**
 * 运行函数
 * @param {Function} func
 * @param thisArg
 * @returns {Function}
 */
function run(func, thisArg = null) {
    return _isFunction(func) ? function(...args) {
        return func.call(thisArg, ...args)
    } : function() {}
}

module.exports = run

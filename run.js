/**
 * 运行函数
 * @param {Function} func
 * @param thisArg
 * @returns {Function}
 */

const _ = require('lodash')

function run(func, thisArg = null) {
    return _.isFunction(func) ? function(...args) {
        return func.call(thisArg, ...args)
    } : function() {}
}

module.exports = run

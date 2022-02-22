import _isFunction from 'lodash/isFunction'

/**
 * 运行函数
 * @param {Function} fn
 * @param _this
 * @returns {Function}
 */

function run(func, thisArg) {
    return _isFunction(func) ? function(...args) {
        return func.call(thisArg, ...args)
    } : function() {}
}

export default run

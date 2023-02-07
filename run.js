import $n_isFunction from 'lodash/isFunction'

/**
 * 运行函数
 * @param {Function} func
 * @param thisArg
 * @returns {Function}
 */
export default function run(func, thisArg = null) {
    return $n_isFunction(func) ? function(...args) {
        return func.call(thisArg, ...args)
    } : function() {}
}

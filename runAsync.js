import _isFunction from 'lodash/isFunction'
import isPromise from './isPromise'

/**
 * 运行函数
 * @param {Function} func
 * @param thisArg
 * @returns {Function}
 */

function runAsync(func, thisArg = null) {
    return _isFunction(func) ? function(...args) {
        return new Promise(function(resolve, reject) {

            const res = func.call(thisArg, ...args)

            if (isPromise(res)) {
                res.then(resolve)
                    .catch(reject)

            } else {
                resolve(res)
            }

        })
    } : async function() {}
}

module.exports = runAsync

import $n_isFunction from 'lodash/isFunction'
import $n_isPromise from './isPromise'

/**
 * 运行异步函数
 * @param {Function} func
 * @param thisArg
 * @returns {Function}
 */
export default function runAsync(func, thisArg = null) {
    return $n_isFunction(func) ? function(...args) {
        return new Promise(function(resolve, reject) {

            const res = func.call(thisArg, ...args)

            if ($n_isPromise(res)) {
                res.then(resolve)
                    .catch(reject)

            } else {
                resolve(res)
            }

        })
    } : async function() {}
}

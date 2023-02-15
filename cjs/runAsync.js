const $n_isFunction = require('lodash/isFunction')
const $n_isPromise = require('./isPromise')

/**
 * 运行异步函数
 * @param {Function} func
 * @param thisArg
 * @returns {Function}
 */
function runAsync(func, thisArg = null) {
    return $n_isFunction(func) ? function (...args) {
        return new Promise(function (resolve, reject) {

            const res = func.call(thisArg, ...args)

            if ($n_isPromise(res)) {
                res.then(resolve)
                    .catch(reject)

            } else {
                resolve(res)
            }

        })
    } : async function () {}
}

module.exports = runAsync
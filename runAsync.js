/**
 * 运行函数
 * @param {Function} func
 * @param thisArg
 * @returns {Function}
 */

const _ = require('lodash')
const isPromise = require('./isPromise')

function runAsync(func, thisArg = null) {
    return _.isFunction(func) ? function(...args) {
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

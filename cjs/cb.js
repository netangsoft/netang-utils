const $n_isFunction = require('lodash/isFunction')

/**
 * 回调
 * @param data
 * @param {function} cb
 */
function cb(data, cb) {
    if ($n_isFunction(cb)) {
        return cb.call(this, data)
    }
}

module.exports = cb
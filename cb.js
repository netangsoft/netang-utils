import $n_isFunction from 'lodash/isFunction'

/**
 * 回调
 * @param data
 * @param {function} cb
 */
export default function cb(data, cb) {
    if ($n_isFunction(cb)) {
        return cb.call(this, data)
    }
}

const $n_isPlainObject = require('lodash/isPlainObject')

const _forEach = require('./.internal/_forEach')
const _forIn = require('./.internal/_forIn')

/**
 * each
 * @param data
 * @param func
 */
function each(data, func) {

    // 如果是数组
    if (Array.isArray(data)) {
        return _forEach(data, func, false)
    }

    // 如果是对象
    if ($n_isPlainObject(data)) {
        return _forIn(data, func)
    }
}

module.exports = each
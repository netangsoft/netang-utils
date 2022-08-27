const _isPlainObject = require('lodash/isPlainObject')
const _forEach = require('./_forEach')
const _forIn = require('./_forIn')

/**
 * each
 * @param data
 * @param func
 */
function each(data, func) {

    // 如果是数组
    if (Array.isArray(data)) {
        return _forEach(data, func)

    // 如果是对象
    } else if (_isPlainObject(data)) {
        return _forIn(data, func)
    }
}

module.exports = each

const _isPlainObject = require('lodash/isPlainObject')
const _forIn = require('./_forIn')

/**
 * forIn
 * @param data
 * @param func
 */
function forIn(data, func) {
    // 如果是对象
    if (_isPlainObject(data)) {
        return _forIn(data, func)
    }
}

module.exports = forIn

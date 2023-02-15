const $n_isPlainObject = require('lodash/isPlainObject')

const _forIn = require('./.internal/_forIn')

/**
 * forIn
 * @param data
 * @param func
 */
function forIn(data, func) {
    // 如果是对象
    if ($n_isPlainObject(data)) {
        return _forIn(data, func)
    }
}

module.exports = forIn
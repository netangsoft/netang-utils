const _forEach = require('./_forEach')

/**
 * forEachRight
 * @param data
 * @param func
 */
function forEachRight(data, func) {

    // 如果是数组
    if (Array.isArray(data)) {
        return _forEach(data, func, true)
    }
}

module.exports = forEachRight

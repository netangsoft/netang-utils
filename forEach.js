const _forEach = require('./_forEach')

/**
 * forEach
 * @param data
 * @param func
 */
function forEach(data, func) {

    // 如果是数组
    if (Array.isArray(data)) {
        return _forEach(data, func)
    }
}

module.exports = forEach

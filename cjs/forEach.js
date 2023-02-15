const _forEach = require('./.internal/_forEach')

/**
 * forEach
 * @param data
 * @param func
 */
function forEach(data, func) {

    // 如果是数组
    if (Array.isArray(data)) {
        return _forEach(data, func, false)
    }
}

module.exports = forEach
const _isPlainObject = require('lodash/isPlainObject')
const isNumeric = require('./isNumeric')

/**
 * forEach
 * @param data
 * @param func
 */
function forEach(data, func) {

    // 如果是数组
    if (Array.isArray(data)) {
        const length = data.length
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                if (func(data[i], i, data) === false) {
                    return false
                }
            }
        }

    // 如果是对象
    } else if (_isPlainObject(data)) {
        for (const key in data) {
            if (
                Object.prototype.hasOwnProperty.call(data, key)
                && func(data[key], isNumeric(key) ? Number(key) : key, data) === false
            ) {
                return false
            }
        }
    }
}

module.exports = forEach

const isNumeric = require('./isNumeric')

/**
 * forIn
 * @param data
 * @param func
 */
function forIn(data, func) {
    for (const key in data) {
        if (
            Object.prototype.hasOwnProperty.call(data, key)
            && func(data[key], isNumeric(key) ? Number(key) : key, data) === false
        ) {
            return false
        }
    }
}

module.exports = forIn

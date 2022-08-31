const _isString = require('lodash/isString')
const isNumeric = require('./isNumeric')

/**
 * 数字年月日
 */

function toString(value, defaultValue = '') {
    if (isNumeric(value)) {
        value = String(value)
        if (value.length === 8) {
            return `${value.substr(0, 4)}-${value.substr(4, 2)}-${value.substr(6, 2)}`
        }
    }
    return defaultValue
}

function toNumber(value, separator = '-') {
    if (_isString(value)) {
        const arr = value.split(separator)
        if (
            arr.length === 3
            && arr[0].length === 4
            && arr[1].length === 2
            && arr[2].length === 2
        ) {
            return Number(arr.join(''))
        }
    }
    return 0
}

module.exports = {
    toString,
    toNumber,
}

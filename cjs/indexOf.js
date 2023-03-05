const $n_isString = require('lodash/isString')
const $n_isNumber = require('lodash/isNumber')

/**
 * 获取索引
 */
function indexOf(value, searchString) {

    if (Array.isArray(value) || $n_isString(value)) {
        return value.indexOf(searchString)
    }

    if ($n_isNumber(value)) {
        return String(value).indexOf(searchString)
    }

    return -1
}

module.exports = indexOf
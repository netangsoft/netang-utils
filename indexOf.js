const _isString = require('lodash/isString')
const _isNumber = require('lodash/isNumber')

/**
 * 获取索引
 */
function indexOf(value, searchString) {

    if (Array.isArray(value) || _isString(value)) {
        return value.indexOf(searchString)
    }

    if (_isNumber(value)) {
        return String(value).indexOf(searchString)
    }

    return -1
}

module.exports = indexOf

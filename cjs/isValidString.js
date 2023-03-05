const $n_isString = require('lodash/isString')
const $n_trim = require('lodash/trim')

/**
 * 检查是否为非空字符串
 * @param value
 * @returns {boolean}
 */
function isValidString(value) {

    return $n_isString(value)
        && $n_trim(value).length > 0
}

module.exports = isValidString
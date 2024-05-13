const $n_isString = require('lodash/isString')
const $n_isNumber = require('lodash/isNumber')
const $n_trim = require('lodash/trim')

/**
 * 去除首位空格的字符串
 * @param {number|string} val 值
 * @returns {string}
 */
function trimString(val, chars = undefined) {

    if ($n_isString(val)) {
        return $n_trim(val, chars)
    }

    if ($n_isNumber(val)) {
        return String(val)
    }

    return ''
}

module.exports = trimString
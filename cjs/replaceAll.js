const $n_isString = require('lodash/isString')

/*
 * 替换全部
 * @param {string} str
 * @param {string|array} searchValue
 * @param {string} replaceValue
 * @returns {string}
 */
function replaceAll(str, searchValue, replaceValue) {
    return $n_isString(str) ? str.replace(RegExp(searchValue, 'g'), replaceValue) : ''
}

module.exports = replaceAll
const _isString = require('lodash/isString')

/*
 * 替换全部
 * @param {string} str
 * @param {string|array} searchValue
 * @param {string} replaceValue
 * @returns {string}
 */
function replaceAll(str, searchValue, replaceValue) {
    if (Number.isFinite(str)) {
        str = String(str)
    }
    return _isString(str) ? str.replaceAll(searchValue, replaceValue) : ''
}

module.exports = replaceAll

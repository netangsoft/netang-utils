const _isString = require('lodash/isString')
const isFillArray = require('./isFillArray')

/*
 * 替换全部
 * @param {string} str
 * @param {string|array} searchValue
 * @param {string} replaceValue
 * @param {string} exp
 * @returns {string}
 */
function replaceAll(str, searchValue, replaceValue, exp = 'g') {

    if (_isString(str)) {

        // 如果是字符串, 则为单个替换
        if (_isString(searchValue)) {
            if (_isString(replaceValue) && searchValue !== replaceValue) {
                str = str.replace(RegExp(searchValue, exp), replaceValue)
            }

        // 如果是数组, 则为批量替换
        } else if (isFillArray(searchValue)) {
            for (const arr of searchValue) {
                if (
                    Array.isArray(arr)
                    && arr.length === 2
                    && _isString(arr[0])
                    && _isString(arr[1])
                    && arr[0] !== arr[1]
                ) {
                    str = str.replace(RegExp(arr[0], exp), arr[1])
                }
            }
        }
    }

    return str
}

module.exports = replaceAll

import $n_isString from 'lodash/isString'

/*
 * 替换全部
 * @param {string} str
 * @param {string|array} searchValue
 * @param {string} replaceValue
 * @returns {string}
 */
export default function replaceAll(str, searchValue, replaceValue) {
    return $n_isString(str) ? str.replace(RegExp(searchValue, 'g'), replaceValue) : ''
}

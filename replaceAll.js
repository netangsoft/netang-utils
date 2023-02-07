import $n_isString from 'lodash/isString'

/*
 * 替换全部
 * @param {string} str
 * @param {string|array} searchValue
 * @param {string} replaceValue
 * @returns {string}
 */
export default function replaceAll(str, searchValue, replaceValue) {
    if (Number.isFinite(str)) {
        str = String(str)
    }
    return $n_isString(str) ? str.replaceAll(searchValue, replaceValue) : ''
}

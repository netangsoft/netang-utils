import $n_isNumber from 'lodash-es/isNumber.js'
import $n_isString from 'lodash-es/isString.js'

/*
 * 替换全部
 * @param {string} str
 * @param {string|array} searchValue
 * @param {string} replaceValue
 * @returns {string}
 */
export default function replaceAll(str, searchValue, replaceValue) {

    // 如果是数字
    if ($n_isNumber(str)) {

        // 转为字符串
        str = String(str)
    }

    return $n_isString(str) ? str.replace(RegExp(searchValue, 'g'), replaceValue) : ''
}

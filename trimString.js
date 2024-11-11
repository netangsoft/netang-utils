import $n_isString from 'lodash-es/isString.js'
import $n_isNumber from 'lodash-es/isNumber.js'
import $n_trim from 'lodash-es/trim.js'

/**
 * 去除首位空格的字符串
 * @param {number|string} val 值
 * @returns {string}
 */
export default function trimString(val, chars = undefined) {

    if ($n_isString(val)) {
        return $n_trim(val, chars)
    }

    if ($n_isNumber(val)) {
        return String(val)
    }

    return ''
}

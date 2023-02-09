import $n_isString from 'lodash/isString'
import $n_isNumber from 'lodash/isNumber'
import $n_trim from 'lodash/trim'

/**
 * 去除首位空格的字符串
 * @param {number|string} val 值
 * @returns {string}
 */
export default function trimString(val) {

    if ($n_isString(val)) {
        return $n_trim(val)
    }

    if ($n_isNumber(val)) {
        return String(val)
    }

    return ''
}

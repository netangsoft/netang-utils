import $n_isNumber from 'lodash-es/isNumber.js'
import $n_numberDeep from './numberDeep.js'
import $n_isValidString from './isValidString.js'

/*
 * 拆分字符串
 * @param {string} str 要拆分的字符串
 * @param {string|RegExp} separator 拆分的分隔符
 * @param {number} limit 限制结果的数量
 * @param {boolean} toNumberDeep 深度转换为数字
 * @returns {array}
 */
export default function split(str = '', separator, limit, toNumberDeep = true) {

    if ($n_isNumber(str)) {
        str = String(str)
    }

    if ($n_isValidString(str)) {
        const arr = str.split(separator, limit)
        return toNumberDeep ? $n_numberDeep(arr) : arr
    }

    return []
}

import $n_isString from 'lodash/isString'
import $n_trim from 'lodash/trim'

/**
 * 检查是否为非空字符串
 * @param value
 * @returns {boolean}
 */
export default function isValidString(value) {

    return $n_isString(value)
        && $n_trim(value).length > 0
}

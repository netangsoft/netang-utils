import $n_isNil from 'lodash/isNil'
import $n_isString from 'lodash/isString'
import $n_trim from 'lodash/trim'

/**
 * 是否为有效值
 * @param value 值
 * @param allowEmptyString 是否允许空字符串
 * @returns {boolean} true: 非空字符串/有效数字
 */
export default function isValidValue(value, allowEmptyString = false) {
    if (! $n_isNil(value)) {
        if ($n_isString(value)) {
            return allowEmptyString ? true : $n_trim(value).length > 0
        }
        return Number.isFinite(value)
    }
    return false
}

import $n_isValidArray from './isValidArray.js'
import $n_isValidObject from './isValidObject.js'
import $n_isValidValue from './isValidValue.js'

/**
 * 是否有值
 * @param value
 * @returns {boolean} true: 非空字符串/有效数字/非空对象/非空数组
 */
export default function isRequired(value) {
    return $n_isValidValue(value)
        || $n_isValidArray(value)
        || $n_isValidObject(value)
}

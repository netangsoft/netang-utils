import $n_isNumber from 'lodash/isNumber.js'
import $n_trim from 'lodash/trim.js'
import $n_isNil from 'lodash/isNil.js'
import $n_isBoolean from 'lodash/isBoolean.js'
import $n_isObjectLike from 'lodash/isObjectLike.js'
import $n_isNumeric from './isNumeric.js'

/**
 * 深度转换为数字
 * @param value 需转换的值
 * @param defaultValue 默认值
 * @param {boolean} isBeginZero2String 如果开头为 0 的数字, 则转为字符串
 * @returns {number|any}
 */
function numberHandle(value, defaultValue = null, isBeginZero2String = false) {

    // 如果值为数字类型 || 布尔类型
    if ($n_isNumber(value) || $n_isBoolean(value)) {

        // 则直接返回值
        return value
    }

    // 如果为字符串数字
    if ($n_isNumeric(value)) {

        // 去除前后空白
        value = $n_trim(value)

        if (
            // 如果长度 > 15
            value.length > 15
            || (
                // 是否检测开头为 0 的数字
                isBeginZero2String
                // 如果字符串长度大于 1
                && value.length > 1
                // 如果字符串数字第一个字符为 0, 则认为是字符串
                && value[0] === '0'
                // 并且第二个字符不为点
                && value[1] !== '.'
            )
        ) {
            return value
        }

        // 将字符串数字转换为数字
        return Number(value)
    }

    // 如果有默认值, 则返回默认值
    if (! $n_isNil(defaultValue)) {
        return defaultValue
    }

    // 否则为原始值
    return value
}

/**
 * 深度转换为数字
 * @param value 需格式化的数据
 * @param defaultValue 默认值
 * @param {boolean} isBeginZero2String 如果开头为 0 的数字, 则转为字符串
 * @returns {number|*}
 */
export default function numberDeep(value, defaultValue = null, isBeginZero2String = false) {
    if ($n_isObjectLike(value)) {
        for (const key in value) {
            if (Object.prototype.hasOwnProperty.call(value, key)) {
                if ($n_isObjectLike(value[key])) {
                    numberDeep(value[key], defaultValue, isBeginZero2String)
                } else {
                    value[key] = numberHandle(value[key], defaultValue, isBeginZero2String)
                }
            }
        }
        return value
    }
    return numberHandle(value, defaultValue, isBeginZero2String)
}

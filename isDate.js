import $n_isString from 'lodash/isString'
import $n_isNumeric from './isNumeric'

/**
 * 判断是否为合法日期格式
 */
export default function isDate(val) {

    if (! val || Array.isArray(val)) {
        return false
    }

    // 如果为数字
    if ($n_isNumeric(val)) {

        // 获取数字长度
        const { length } = $n_isString(val) ? val : String(val)

        // 如果为毫秒时间戳 || 普通时间戳
        return length === 13 || length === 10
    }

    return ! isNaN(new Date($n_isString(val) ? val.replace(/-/g, '/') : val).getTime())
}

import $n_isNil from 'lodash/isNil'
import $n_isString from 'lodash/isString'
import $n_isNumeric from './isNumeric'

/**
 * 转换日期格式
 */
export default function toDate(val) {

    if (! $n_isNil(val) && ! Array.isArray(val)) {

        // 如果为数字
        if ($n_isNumeric(val)) {

            let length
            if ($n_isString(val)) {
                length = val.length
                val = Number(val)
            } else {
                length = String(val).length
            }

            // 如果为毫秒时间戳
            if (length === 13) {
                return new Date(val)
            }

            // 如果为普通时间戳
            if (length === 10) {
                return new Date(val * 1000)
            }

        } else {

            val = new Date($n_isString(val) ? val.replace(/-/g, '/') : val)

            if (! isNaN(val.getTime())) {
                return val
            }
        }
    }

    // 否则为当前时间
    return new Date()
}

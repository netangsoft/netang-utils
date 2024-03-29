import $n_isString from 'lodash/isString'
import $n_isNumber from 'lodash/isNumber'

/**
 * 获取索引
 */
export default function indexOf(value, searchString) {

    if (Array.isArray(value) || $n_isString(value)) {
        return value.indexOf(searchString)
    }

    if ($n_isNumber(value)) {
        return String(value).indexOf(searchString)
    }

    return -1
}

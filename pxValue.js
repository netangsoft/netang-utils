import $n_isNumeric from './isNumeric'
import $n_indexOf from './indexOf'
import $n_replaceAll from './replaceAll'

/**
 * 获取像素值
 * 89px -> 89
 */
export default function pxValue(value, defaultValue = 0, sign = 'px') {

    // 如果含有 px
    if ($n_indexOf(value, sign) > -1) {
        // 去除所有 px 符号
        value = $n_replaceAll(value, sign, '')
    }

    // 如果是数字
    if ($n_isNumeric(value)) {
        return Number(value)
    }

    return defaultValue
}

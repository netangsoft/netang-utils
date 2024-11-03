import $n_isNumeric from './isNumeric.js'
import $n_indexOf from './indexOf.js'

/**
 * 转为像素
 */
export default function px(value, sign = 'px') {

    // 如果是数字
    if ($n_isNumeric(value)) {
        return value + sign
    }

    // 如果含有 px
    if ($n_indexOf(value, sign) > -1) {
        return value
    }
}

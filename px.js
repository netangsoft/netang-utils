import isNumeric from './isNumeric'
import indexOf from './indexOf'

/**
 * 转为像素
 */
function px(value, sign = 'px') {

    // 如果是数字
    if (isNumeric(value)) {
        return value + sign
    }

    // 如果含有 px
    if (indexOf(value, sign) > -1) {
        return value
    }
}

module.exports = px

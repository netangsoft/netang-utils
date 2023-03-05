const $n_isNumeric = require('./isNumeric')
const $n_indexOf = require('./indexOf')

/**
 * 获取像素值
 * 89px -> 89
 */
function pxValue(value, defaultValue = 0, sign = 'px') {

    // 如果含有 px
    if ($n_indexOf(value, sign) > -1) {
        // 去除所有 px 符号
        value = value.replaceAll(sign, '')
    }

    // 如果是数字
    if ($n_isNumeric(value)) {
        return Number(value)
    }

    return defaultValue
}

module.exports = pxValue
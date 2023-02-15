const $n_isNumeric = require('./isNumeric')
const $n_indexOf = require('./indexOf')

/**
 * 转为像素
 */
function px(value, sign = 'px') {

    // 如果是数字
    if ($n_isNumeric(value)) {
        return value + sign
    }

    // 如果含有 px
    if ($n_indexOf(value, sign) > -1) {
        return value
    }
}

module.exports = px
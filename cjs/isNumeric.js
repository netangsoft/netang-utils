const $n_isString = require('lodash/isString')

/**
 * 检查是否为数字(包括字符串数字)
 * @param {number|string} value
 * @returns {boolean}
 */
function isNumeric(value) {
    if ($n_isString(value)) {
        return (value - parseFloat(value) + 1) >= 0
    }
    return Number.isFinite(value)
}

module.exports = isNumeric
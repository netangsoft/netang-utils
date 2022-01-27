const _ = require('lodash')

/**
 * 检查是否为数字(包括字符串数字)
 * @param {number|string} value
 * @returns {boolean}
 */

function isNumeric(value) {

    return _.isNumber(value)
        || (
            _.isString(value)
            && (value - parseFloat(value) + 1) >= 0
        )
}

module.exports = isNumeric

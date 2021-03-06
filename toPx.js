const isNumeric = require('./isNumeric')

/**
 * 数字转像素
 * @param {number} val
 * @returns {string}
 */

function toPx(val) {
    return isNumeric(val) ? val + 'px' : val
}

module.exports = toPx

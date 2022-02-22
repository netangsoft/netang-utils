import isNumeric from './isNumeric'

/**
 * 数字转像素
 * @param {number} val
 * @returns {string}
 */

function toPx(val) {
    return isNumeric(val) ? val + 'px' : val
}

export default toPx

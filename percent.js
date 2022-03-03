const _isNumber = require('lodash/isNumber')
const toNumberDeep = require('./toNumberDeep')

/**
 * 计算百分比
 * @param {number|string} val
 * @param {boolean} isSign
 * @returns {string|number}
 */

function percent(val, isSign) {

    val = toNumberDeep(val)

    if (_isNumber(val) && val > 0) {

        if (100 % val === 0) {
            val = 100 / val

        } else {
            val = Number((100 / val).toFixed(10))
        }

    } else {
        val = 0
    }

    if (isSign === true) {
        return `${val}%`
    }

    return val
}

module.exports = percent

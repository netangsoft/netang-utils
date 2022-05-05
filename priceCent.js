const _toNumber = require('lodash/toNumber')
const isNumeric = require('./isNumeric')

/**
 * 价格(元转分)
 * @param value
 * @returns {number|*}
 */

function priceCent(value) {
    if (value && isNumeric(value)) {
        const price = _toNumber(value)
        return price > 0 ? price * 100 : 0
    }
    return value
}

module.exports = priceCent

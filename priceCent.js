const _ = require('lodash')
const isNumeric = require('./isNumeric')

/**
 * 价格(元转分)
 * @param val
 * @returns {number|*}
 */

function priceCent(val) {
    if (val && isNumeric(val)) {
        const price = _.toNumber(val)
        return price > 0 ? price * 100 : 0
    }
    return val
}

module.exports = priceCent

import _toNumber from 'lodash/toNumber'
import isNumeric from './isNumeric'

/**
 * 价格(元转分)
 * @param value
 * @returns {number|*}
 */

function priceCent(val) {
    if (val && isNumeric(val)) {
        const price = _toNumber(val)
        return price > 0 ? price * 100 : 0
    }
    return val
}

module.exports = priceCent

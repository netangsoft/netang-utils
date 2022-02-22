import _isNil from 'lodash/isNil'
import _toNumber from 'lodash/toNumber'
import isNumeric from './isNumeric'

/**
 * 格式化数字精度
 * @param {number|string} value
 * @param {number} precision
 * @param {boolean} toFixed
 * @returns {number}
 */

function precision(value, precision, toFixed) {

    if (_isNil(value)) {
        return value
    }

    if (! precision) {
        precision = 0
    }

    value = Number(isNumeric(value) ? value : value.replace(/[^-\d.]/g, ''))

    const res = parseFloat(String(Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)))

    return toFixed ? res.toFixed(precision) : _toNumber(res)
}

export default precision

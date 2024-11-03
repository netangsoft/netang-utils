import $n_isString from 'lodash/isString.js'
import $n_isNumeric from './isNumeric.js'

function toString(value, separator = '-', defaultValue = '') {
    if ($n_isNumeric(value)) {
        value = String(value)
        const isLen8 = value.length === 8
        if (isLen8 || value.length === 6) {
            let val = `${value.substr(0, 4)}${separator}${value.substr(4, 2)}`
            if (isLen8) {
                val += `${separator}${value.substr(6, 2)}`
            }
            return val
        }
    }
    return defaultValue
}

function toNumber(value, separator = '-') {
    if ($n_isString(value)) {
        const arr = value.split(separator)
        const isLen3 = arr.length === 3
        if (
            (isLen3 || arr.length === 2)
            && arr[0].length === 4
            && arr[1].length === 2
            && (! isLen3 || arr[2].length === 2)
        ) {
            return Number(arr.join(''))
        }
    }
    return 0
}

/**
 * 数字年月日
 */
const ymd = {
    toString,
    toNumber,
}

export default ymd

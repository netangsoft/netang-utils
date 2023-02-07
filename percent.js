import BigNumber from 'bignumber.js'

import $n_isNumeric from './isNumeric'
import $n_indexOf from './indexOf'

/**
 * 转为百分比
 * @param {number|string} value
 * @param {boolean} isSign
 * 0.89 -> 89%
 */
export default function percent(value, isSign) {

    // 如果是数字
    if ($n_isNumeric(value)) {

        // 转为 BigNumber 格式
        value = new BigNumber(value)

        // 如果值 > 0
        if (value.isGreaterThan(0)) {

            // 如果值 >= 1
            if (value.isGreaterThanOrEqualTo(1)) {
                value = 100

            } else {
                // 值乘以 100
                value = value.times(100)
            }

        } else {
            value = 0
        }

    } else {

        // 如果有百分号
        if ($n_indexOf(value, '%') > -1) {
            return value
        }

        value = 0
    }

    if (isSign) {
        return `${value}%`
    }

    return value
}

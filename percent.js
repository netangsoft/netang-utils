const isNumeric = require('./isNumeric')
const indexOf = require('./indexOf')

/**
 * 转为百分比
 * @param {number|string} value
 * @param {boolean} isSign
 * 0.89 -> 89%
 */
function percent(value, isSign) {

    // 如果是数字
    if (isNumeric(value)) {

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
        if (indexOf(value, '%') > -1) {
            return value
        }

        value = 0
    }

    if (isSign) {
        return `${value}%`
    }

    return value
}

module.exports = percent

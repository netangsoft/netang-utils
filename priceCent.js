const BigNumber = require('bignumber.js')
const isNumeric = require('./isNumeric')

/**
 * 换算金额(元转分)
 */
function priceCent(value, defaultValue = 0) {
    if (isNumeric(value)) {

        // 转为 BigNumber 格式
        value = new BigNumber(value)

        // 如果值为 0
        if (value.isZero()) {
            return 0
        }

        // 如果值 > 0
        if (value.isGreaterThan(0)) {

            // 将元向下舍入 2 位精度(如 68.345 -> 68.34)
            return value.decimalPlaces(2, BigNumber.ROUND_DOWN)
                // 再乘以 100
                .times(100)
                // 转为数字
                .toNumber()
        }
    }

    return defaultValue
}

module.exports = priceCent

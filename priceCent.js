const BigNumber = require('bignumber.js')
const isNumeric = require('./isNumeric')

/**
 * 换算金额(元转分)
 */
function priceCent(value, defaultValue = 0) {
    if (isNumeric(value)) {

        // 转为 BigNumber 格式
        value = new BigNumber(value)

        // 如果值 === 0
        if (value.isEqualTo(0)) {
            return 0
        }

        // 如果值 > 0
        if (value.isGreaterThan(0)) {
            return value.times(100).toNumber()
        }
    }

    return defaultValue
}

module.exports = priceCent

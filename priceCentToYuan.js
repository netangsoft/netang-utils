const BigNumber = require('bignumber.js')
const split = require('./split')

/**
 * 换算金额(分转元)(废弃)
 */
function priceCentToYuan(value, defaultValue = 0, isAddComma = false) {

    // 转为 BigNumber 格式
    value = new BigNumber(value)

    // 如果为有效数字
    if (value.isFinite()) {

        // 如果值为 0
        if (value.isZero()) {
            return 0
        }

        // 如果值 > 0
        if (value.gt(0)) {

            value =
                // 分 除以 100
                value.dividedBy(100)
                    // 将元向下舍入 2 位精度(如 68.345 -> 68.34)
                    .dp(2, BigNumber.ROUND_DOWN)
                    // 转为数字
                    .toNumber()

            // 如果加逗号隔开
            if (isAddComma) {
                const arr = split(String(value), '.')
                if (arr.length) {
                    value = String(arr[0]).replace(/\B(?=(\d{3})+$)/g,',')
                    if (arr.length > 1) {
                        value += '.' + arr[1]
                    }
                }
            }

            return value
        }
    }

    return defaultValue
}

module.exports = priceCentToYuan

const BigNumber = require('bignumber.js')
const isNumeric = require('@netang/utils/isNumeric')
const split = require('@netang/utils/split')

/**
 * 换算金额(分转元)
 */
function price(value, defaultValue = 0, isAddComma = false) {

    if (isNumeric(value)) {

        // 转为 BigNumber 格式
        value = new BigNumber(value)

        if (value.isFinite()) {

            // 如果值为 0
            if (value.isZero()) {
                return 0
            }

            // 如果值 > 0
            if (value.isGreaterThan(0)) {

                value =
                    // 分 除以 100
                    value.dividedBy(100)
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
    }

    return defaultValue
}

module.exports = price

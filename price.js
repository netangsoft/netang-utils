const BigNumber = require('bignumber.js')
const isNumeric = require('./isNumeric')
const precision = require('./precision')
const split = require('./split')

/**
 * 换算金额(分转元)
 */
function price(value, toFixed = false, defaultValue = 0, isAddComma = false, isCent = true) {

    if (isNumeric(value)) {

        // 转为 BigNumber 格式
        value = new BigNumber(value)

        // 如果值 > 0
        if (value.isGreaterThan(0)) {

            // 如果单位是分, 则除以 100
            if (isCent) {
                value = new BigNumber(value).dividedBy(100)
            }

            value = precision(value, 2, toFixed)

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

module.exports = price

const BigNumber = require('bignumber.js')

/**
 * 简单数字计算
 */
function calc(v1, symbol = '', v2, defaultValue = 0, returnBigNumber = false) {

    v1 = new BigNumber(v1)
    v2 = new BigNumber(v2)

    if (
        v1.isFinite()
        && v2.isFinite()
    ) {
        switch (symbol) {
            case '+':
                v1 = v1.plus(v2)
            break
            case '-':
                v1 = v1.minus(v2)
            break
            case '*':
                v1 = v1.times(v2)
            break
            case '/':
                v1 = v1.div(v2)
            break
            case '%':
                v1 = v1.mod(v2)
            break
            default:
                return defaultValue
        }

        return returnBigNumber ? v1 : v1.toNumber()
    }

    return defaultValue
}

module.exports = calc
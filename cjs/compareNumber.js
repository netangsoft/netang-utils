const BigNumber = require('bignumber.js')

/**
 * 比较数字
 * v1 > v2 return 1
 * v1 < v2 return -1
 * v1 == v2 return 0
 * NAN return null
 */
function compareNumber(v1 , v2) {
    return (new BigNumber(v1)).comparedTo(v2)
}

module.exports = compareNumber
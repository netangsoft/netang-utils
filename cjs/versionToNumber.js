const $n_padStart = require('lodash/padStart')
const $n_split = require('./split')

/**
 * 版本号转数字
 * @param value 版本号
 * @param digit 版本每段数量
 * @returns {number}
 */
function versionToNumber(value, digit = 2) {

    value = $n_split(value, '.')

    let code = ''

    const len = value.length

    for (let i = 0; i < len; i++) {
        const val = Number(value[i])
        const num = $n_padStart(val > 0 ? val : 0, digit, '0')
        code += (i > 0 && num.length > digit ? num.slice(-digit) : num)
    }

    return Number(code)
}

module.exports = versionToNumber